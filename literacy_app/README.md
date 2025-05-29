
# Literacy App MVP (Client-Side Only)

## Overview

This project is a Minimum Viable Product (MVP) for a web-based literacy application designed to help students with CVC (Consonant-Vowel-Consonant) words. **This version is a purely client-side application that runs entirely in the browser, using `localStorage` for data persistence.**

It features:
-   User profile creation (storing a username).
-   A simple placement quiz to determine an initial learning set.
-   An interactive CVC word matching activity (image to word).
-   Basic progress tracking.

**Limitations of Client-Side Storage:**
-   All data (user profile, progress) is stored in the browser's `localStorage`.
-   This data will be lost if the user clears their browser data or uses a different browser or device.
-   There are no true user accounts or server-side authentication.

## Technologies Used

-   **Frontend:** HTML, CSS, Vanilla JavaScript
-   **Data Storage:** Browser `localStorage`

## Project Structure

-   `/css`: CSS files for styling.
-   `/js`: JavaScript files for application logic.
    -   `data_manager.js`: Handles all interactions with `localStorage` and defines data structures.
    -   `auth.js`: Manages user profile state (active/inactive).
    -   `login.js`: Handles creation/loading of user profile.
    -   `placement_quiz.js`: Logic for the placement quiz.
    -   `cvc_activity.js`: Logic for the CVC word matching activity.
    -   `dashboard.js`: Displays user progress and learning focus.
-   `/images`: Image assets for activities.
-   `*.html`: HTML files for different pages of the application (`index.html`, `login.html`, `dashboard.html`, `placement_quiz.html`, `activity_cvc.html`).
-   `register.html`: Currently redirects to `login.html` as profile creation is handled there.

## Local Development & Usage

1.  **Prerequisites:**
    -   A modern web browser.
2.  **Running the Application:**
    -   Clone or download the repository.
    -   Navigate to the `literacy_app` directory.
    -   Open the `index.html` file in your web browser. (This will redirect to `login.html` which acts as the entry point).
    -   Alternatively, you can directly open `literacy_app/login.html`.
3.  **How it Works:**
    -   The application will prompt you to enter a name to create a simple user profile, which is stored locally.
    -   Your progress (quiz results, mastered words) will also be saved in your browser's `localStorage`.

## Deployment (GitHub Pages)

1.  **Commit Code:** Ensure all application code (HTML, CSS, JS, images within the `literacy_app` folder) is committed to your GitHub repository.
2.  **Set up GitHub Pages:**
    -   Go to your repository settings on GitHub.
    -   Navigate to the "Pages" section (under "Code and automation").
    -   **Source:** Choose "Deploy from a branch".
    -   **Branch:** Select the branch you want to deploy (e.g., `main`).
        -   For the folder, select `/ (root)` if your `literacy_app` contents are at the root of this branch.
        -   If your `literacy_app` folder is a subdirectory within the branch, you might need to adjust your repository structure (e.g., move contents of `literacy_app` to the root or a `/docs` folder) or ensure your GitHub Pages configuration correctly points to the directory containing `index.html`. Typically, for a project structured with an outer `repository-name/literacy_app/index.html`, you'd want the `literacy_app` contents to be at the root of the branch being deployed, or use a build step to move them there.
        -   **Simplest approach for current structure:** If your repository *only* contains the `literacy_app` folder and its contents, deploying the `main` branch from `/ (root)` might work if GitHub Pages serves files from that subdirectory by default, or you might need to make `literacy_app` the root of the repository content being pushed.
        -   Alternatively, move all contents of the `literacy_app` folder (all HTML, JS, CSS, images folders) to the root of your repository branch. Then deploying from `/ (root)` will work directly.
3.  **Accessing the Deployed App:**
    -   Once deployed, GitHub Pages will provide a URL (e.g., `https://<your-username>.github.io/<repository-name>/`).
    -   No backend deployment is needed as this is a client-side only application.

## Future Considerations (If a Backend Were Re-introduced)
-   Secure user authentication.
-   Centralized data storage for cross-device access.
-   Teacher/administrator roles and advanced reporting.
```

