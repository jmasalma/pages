// literacy_app/js/register.js
document.addEventListener('DOMContentLoaded', () => {
    // The registration functionality is now handled by login.html if no profile exists.
    // Redirect users from register.html to login.html.
    window.location.href = 'login.html?from=register'; // Optional query param for tracking
});
