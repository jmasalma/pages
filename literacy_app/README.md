# Literacy App MVP

## Overview

This project is a Minimum Viable Product (MVP) for a web-based literacy application designed to help students, particularly with CVC (Consonant-Vowel-Consonant) words. It features user registration, login, a simple placement quiz, an interactive CVC word matching activity, and basic progress tracking.

The primary goal is to provide a foundational student-facing experience. Teacher and administrator functionalities are out of scope for this MVP.

## Technologies Used

-   **Frontend:** HTML, CSS, Vanilla JavaScript
-   **Backend:** Python, Flask
-   **Database:** SQLite
-   **Authentication:** JWT (JSON Web Tokens) for API authentication

## Project Structure

- `/css`: CSS files
- `/js`: JavaScript files
- `/images`: Image assets
- `/app.py`: Flask backend application
- `/wsgi.py`: WSGI entry point for deployment (e.g., on PythonAnywhere)
- `/requirements.txt`: Python backend dependencies
- `*.html`: Frontend HTML files
- `literacy_app.db`: SQLite database (created automatically by Flask/SQLAlchemy)

## Local Development

**Prerequisites:**
-   Python (3.7+ recommended) and `pip`.
-   A modern web browser.

1.  **Backend:**
    - Navigate to the `literacy_app` directory.
    - Create a virtual environment: `python -m venv venv`
    - Activate it: `source venv/bin/activate` (Linux/macOS) or `venv\Scripts\activate` (Windows)
    - Install dependencies: `pip install -r requirements.txt`
    - **SECRET_KEY:** For local development, the `app.py` uses a hardcoded `SECRET_KEY`. This is for convenience and should NOT be used in production.
    - Run the Flask app: `python app.py`
    - The backend will run on `http://127.0.0.1:5000`. The database `literacy_app.db` will be created in the `literacy_app` folder.
2.  **Frontend:**
    - Open the `.html` files directly in your browser (e.g., `literacy_app/index.html` from the repository root, or navigate into `literacy_app` first).
    - **API_BASE_URL:** Ensure the `API_BASE_URL` in `js/auth.js` points to your local backend: `http://127.0.0.1:5000/api`. This is its default state.

## Deployment

### Frontend (GitHub Pages)

1.  Ensure all frontend code is committed to your GitHub repository.
2.  Go to your repository settings on GitHub.
3.  Navigate to the "Pages" section.
4.  Choose the branch to deploy from (e.g., `main` or `gh-pages`).
5.  Select the `/ (root)` folder or `/docs` folder if your code is there. The current structure assumes files are in a `literacy_app` subfolder, so you might need to adjust your repository structure or GitHub Pages source setting (e.g., deploy from the `literacy_app` folder if possible, or move frontend files to root/docs for Pages). *For this project, if `literacy_app` is the root of what's checked into GH Pages, it might work directly.*
6.  Once deployed, GitHub Pages will provide a URL (e.g., `https://<your-username>.github.io/<repository-name>/`).
7.  **Crucially, update `API_BASE_URL` in `js/auth.js` in your *deployed frontend code* (or before pushing the version to be deployed) to point to your live PythonAnywhere backend URL (e.g., `https://<your-username>.pythonanywhere.com/api`).**

### Backend (PythonAnywhere - Example)

1.  Sign up/Log in to [PythonAnywhere](https://www.pythonanywhere.com/).
2.  **Upload Files:**
    - Go to the "Files" tab.
    - Create a directory for your project (e.g., `/home/<your-username>/literacy_app_backend`).
    - Upload your backend files (`app.py`, `wsgi.py`, `requirements.txt`) into this directory.
    - (Note: For a real project, you'd typically use `git clone` here from your repository).
3.  **Create a Web App:**
    - Go to the "Web" tab.
    - Click "Add a new web app".
    - Choose your domain (e.g., `<your-username>.pythonanywhere.com`).
    - Select "Flask" as the Python web framework.
    - Choose the Python version (e.g., Python 3.9+).
    - It will auto-generate a WSGI file path; change it to point to your uploaded `wsgi.py`. For example, if you uploaded to `/home/<your-username>/literacy_app_backend/wsgi.py`, use that path.
        - Source code: `/home/<your-username>/literacy_app_backend`
        - WSGI configuration file: `/home/<your-username>/literacy_app_backend/wsgi.py` (The path needs to be exact).
4.  **Virtual Environment:**
    - PythonAnywhere usually prompts you to create/use a virtual environment for your web app.
    - Open a "Bash console" from the "Consoles" tab.
    - Navigate to your project directory (e.g., `cd literacy_app_backend`).
    - Create and set up the virtualenv if not done by PA: `virtualenv --python=python3.x venv_literacy` (replace x)
    - Activate it: `source venv_literacy/bin/activate`
    - Install dependencies: `pip install -r requirements.txt`
    - You can also set the virtualenv path in the "Web" tab settings for your app.
5.  **Database:**
    - The SQLite database (`literacy_app.db`) will be created in your source code directory on PythonAnywhere (e.g., `/home/<your-username>/literacy_app_backend/literacy_app.db`) when the app first runs and tries to access the DB.
6.  **SECRET_KEY (Environment Variable - Strongly Recommended for Production):**
    - In the "Web" tab on PythonAnywhere, scroll to "Environment variables".
    - Add an environment variable: `SECRET_KEY` with a strong, unique random value.
    - **To use this in `app.py` (recommended for production):**
        - Add `import os` at the top of `app.py`.
        - Change `app.config['SECRET_KEY'] = 'your_very_secret_key_that_should_be_in_env_var'`
          to `app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'a_default_fallback_key_if_not_set')`. The fallback is optional but can prevent crashes if the env var is missing.
    - *For this MVP, the code uses a hardcoded key, but the comment in `app.py` and these instructions highlight the need to change this for production.*
7.  **Reload Web App:**
    - Click the "Reload" button on the "Web" tab for your web app.
    - Check the error logs and server logs if anything goes wrong.
8.  Your backend API will be live at `https://<your-username>.pythonanywhere.com` (the `/api/...` part is handled by your Flask routes). **Use this base URL (e.g., `https://<your-username>.pythonanywhere.com/api`) as the `API_BASE_URL` in your frontend's `js/auth.js`.**
