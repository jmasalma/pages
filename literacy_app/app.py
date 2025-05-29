from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS # For handling Cross-Origin Resource Sharing
import jwt # PyJWT for token generation
import datetime

app = Flask(__name__)
CORS(app) # Enable CORS for all routes, allowing frontend to call backend

# Configuration
# IMPORTANT: In a production environment, SECRET_KEY should be a strong, random value
# and ideally set as an environment variable, not hardcoded.
app.config['SECRET_KEY'] = 'your_very_secret_key_that_should_be_in_env_var' # Change this!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///literacy_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Database Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('progress', lazy=True, uselist=False)) # one-to-one for this simple case
    placement_level = db.Column(db.String(50), nullable=True) # e.g., "CVC_Level_1", "CVC_Level_2"
    quiz_completed = db.Column(db.Boolean, default=False)
    current_cvc_set = db.Column(db.String(200), nullable=True) # e.g., "cat,hat,bat"
    mastered_cvc_words = db.Column(db.Text, nullable=True) # comma-separated list of mastered words

    def __repr__(self):
        return f'<UserProgress for User {self.user_id}>'

def get_current_user():
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return None
    try:
        token = token.split('Bearer ')[1]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = User.query.filter_by(id=data['user_id']).first()
        return user
    except:
        return None

# API Endpoints
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password_hash=hashed_password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        # Initialize UserProgress for the new user
        new_user_progress = UserProgress(user_id=new_user.id, quiz_completed=False, mastered_cvc_words="")
        db.session.add(new_user_progress)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Registration failed", "error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'username': user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24) # Token expires in 24 hours
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({"message": "Login successful", "token": token}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 401

@app.route('/api/submit_placement_quiz', methods=['POST'])
def submit_placement_quiz():
    current_user = get_current_user()
    if not current_user:
        return jsonify({"message": "Authentication required"}), 401

    data = request.get_json()
    answers = data.get('answers') # {'q1': 'cat_pic_correct', 'q2': 'sun_pic_correct', ...}

    if not answers or len(answers) < 5: # Expecting 5 answers
        return jsonify({"message": "All quiz questions must be answered"}), 400

    correct_answers = 0
    correct_key = {
        'q1': 'cat_pic_correct', 'q2': 'sun_pic_correct', 'q3': 'pin_pic_correct',
        'q4': 'top_pic_correct', 'q5': 'bug_pic_correct'
    }

    for question_id, submitted_answer in answers.items():
        if correct_key.get(question_id) == submitted_answer:
            correct_answers += 1
    
    placement_level_result = "CVC_Level_1_Beginner"
    initial_cvc_set = "cat,hat,bat,mat,pat" 

    if correct_answers >= 4: 
        placement_level_result = "CVC_Level_2_Intermediate"
        initial_cvc_set = "sun,run,fun,bun,nun" 
    elif correct_answers >= 2: 
        placement_level_result = "CVC_Level_1_Review" 
        initial_cvc_set = "cot,hot,dot,pot,lot" 

    progress = UserProgress.query.filter_by(user_id=current_user.id).first()
    if not progress: # Should be created at registration, but as a fallback
        progress = UserProgress(user_id=current_user.id)
        db.session.add(progress)
    
    progress.placement_level = placement_level_result
    progress.quiz_completed = True
    progress.current_cvc_set = initial_cvc_set 
    progress.mastered_cvc_words = "" 

    try:
        db.session.commit()
        return jsonify({
            "message": "Quiz processed successfully!",
            "placement_level": placement_level_result,
            "score": f"{correct_answers} out of 5",
            "initial_cvc_set": initial_cvc_set.split(',')
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to save quiz results", "error": str(e)}), 500

@app.route('/api/user_progress', methods=['GET'])
def get_user_progress():
    current_user = get_current_user()
    if not current_user:
        return jsonify({"message": "Authentication required"}), 401

    progress = UserProgress.query.filter_by(user_id=current_user.id).first()
    if not progress: # Should not happen if progress is created on registration
        return jsonify({"message": "User progress not found.", "quiz_completed": False}), 404

    if not progress.quiz_completed:
        return jsonify({"message": "Placement quiz not completed yet.", "quiz_completed": False}), 200 

    return jsonify({
        "message": "User progress fetched successfully.",
        "quiz_completed": progress.quiz_completed,
        "placement_level": progress.placement_level,
        "current_cvc_set": progress.current_cvc_set.split(',') if progress.current_cvc_set else [],
        "mastered_cvc_words": progress.mastered_cvc_words.split(',') if progress.mastered_cvc_words else []
    }), 200

@app.route('/api/submit_cvc_answer', methods=['POST'])
def submit_cvc_answer():
    current_user = get_current_user()
    if not current_user:
        return jsonify({"message": "Authentication required"}), 401

    data = request.get_json()
    word = data.get('word')
    mastered = data.get('mastered') # boolean, true if user got it right

    if not word:
        return jsonify({"message": "Word must be provided"}), 400
    
    if mastered is None: # Check for None explicitly because False is a valid value
        return jsonify({"message": "'mastered' field (true/false) must be provided"}), 400

    progress = UserProgress.query.filter_by(user_id=current_user.id).first()
    if not progress:
        # This case should ideally not be hit if UserProgress is created upon registration
        # and quiz completion is a prerequisite for CVC activities.
        return jsonify({"message": "User progress not found. Please complete placement quiz."}), 404

    if mastered: # Only add to mastered list if correct
        mastered_words_list = progress.mastered_cvc_words.split(',') if progress.mastered_cvc_words else []
        if word not in mastered_words_list:
            # Ensure the word is part of the current set before marking as mastered (optional check)
            current_set_list = progress.current_cvc_set.split(',') if progress.current_cvc_set else []
            if word not in current_set_list:
                 # This might indicate a logic error on frontend or an attempt to submit an invalid word
                return jsonify({"message": f"Word '{word}' is not in the current learning set."}), 400

            mastered_words_list.append(word)
            progress.mastered_cvc_words = ','.join(mastered_words_list)
            
            try:
                db.session.commit()
                return jsonify({"message": f"Answer for '{word}' recorded as mastered."}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({"message": "Failed to save answer", "error": str(e)}), 500
        else:
            return jsonify({"message": f"'{word}' already mastered."}), 200
    else:
        # For MVP, we don't explicitly track incorrect attempts on specific words in the DB,
        # but this endpoint could be extended to do so.
        return jsonify({"message": f"Answer for '{word}' noted as incorrect attempt."}), 200


@app.route('/api/protected', methods=['GET']) # Example protected route
def protected():
    current_user = get_current_user()
    if not current_user:
        return jsonify({'message': 'Authentication required!'}), 401
    return jsonify({'message': f'Hello, {current_user.username}! This is a protected route.'}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create database tables if they don't exist
    app.run(debug=True) # Runs on http://127.0.0.1:5000 by default
