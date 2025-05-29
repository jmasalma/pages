import sys
import os

# Add your project directory to the sys.path
project_home = os.path.abspath(os.path.join(os.path.dirname(__file__))) # Should point to literacy_app directory
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Make sure the current working directory is the project home
# This helps Flask find templates, static files (if served by Flask), and the SQLite DB
os.chdir(project_home)

# Import your Flask app instance
# The 'app' variable must be the Flask application instance.
# If your main Flask file is app.py (i.e., literacy_app/app.py), then:
from app import app as application  # PythonAnywhere looks for 'application' by default

# If you have any print statements for debugging in your app.py that you don't want in production logs,
# you might want to remove or conditionalize them.
