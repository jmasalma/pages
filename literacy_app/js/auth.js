// literacy_app/js/auth.js

// API_BASE_URL is no longer needed.

/**
 * Checks if a user profile is active (i.e., user is "logged in").
 * If not, redirects to the login/profile setup page.
 * This function should be called at the beginning of pages requiring an active profile.
 */
function checkAuth() {
    const profile = getUserProfile(); // From data_manager.js
    if (!profile.isLoggedIn) {
        // Allow access to login.html even if not logged in (it's the entry point)
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
}

/**
 * "Logs out" the user by clearing their data from localStorage
 * and redirecting to the login/profile page.
 */
function logoutUser() {
    clearUserData(); // From data_manager.js
    // No need to clear individual items if clearUserData resets the profile object correctly
    window.location.href = 'login.html';
}

/**
 * Gets the currently active username.
 * @returns {string|null} The username or null if no active profile.
 */
function getCurrentUsername() {
    const profile = getUserProfile();
    if (profile.isLoggedIn) {
        return profile.username;
    }
    return null;
}
