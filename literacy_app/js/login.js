// literacy_app/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const usernameInput = document.getElementById('username');
    const welcomeTitle = document.getElementById('welcomeTitle');
    const actionButton = document.getElementById('actionButton');
    const existingUserText = document.getElementById('existingUserText');
    const existingUsernameSpan = document.getElementById('existingUsername');
    const continueLink = document.getElementById('continueLink');
    const resetUserLink = document.getElementById('resetUserLink');

    const profile = getUserProfile(); // From data_manager.js

    if (profile.isLoggedIn && profile.username) {
        // User is already "logged in"
        welcomeTitle.textContent = `Welcome back, ${profile.username}!`;
        userForm.style.display = 'none'; // Hide form
        existingUsernameSpan.textContent = profile.username;
        existingUserText.style.display = 'block';

        continueLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });

        resetUserLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to reset and start over? Your progress will be lost.")) {
                clearUserData();
                window.location.reload(); // Refresh page to show form
            }
        });
        // If user is already logged in and on login.html, maybe redirect to dashboard?
        // Or let them choose to continue or reset. Current setup is fine.

    } else {
        // No active profile, or user explicitly logged out
        welcomeTitle.textContent = 'Create Your Profile';
        actionButton.textContent = 'Save Profile & Start';
        userForm.style.display = 'block';
        existingUserText.style.display = 'none';
    }

    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const enteredUsername = usernameInput.value.trim();

        if (!enteredUsername) {
            alert("Please enter your name.");
            return;
        }

        let userProfileToSave = getUserProfile(); // Get current or default
        userProfileToSave.username = enteredUsername;
        userProfileToSave.isLoggedIn = true;
        // Reset progress fields if creating a new profile or "starting over"
        // (Handled by clearUserData if reset, or default values if new)
        // If it's a fresh profile, quizCompleted etc. will be false by default.

        saveUserProfile(userProfileToSave); // From data_manager.js
        alert(`Profile created for ${enteredUsername}!`);
        window.location.href = 'dashboard.html'; // Go to dashboard (which will check for quiz)
    });

});
