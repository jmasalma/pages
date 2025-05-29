// IMPORTANT: Update this URL to your live backend API endpoint for production deployment
const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Adjust if your Flask app runs elsewhere

// Function to handle logout (will be expanded)
function logoutUser() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    localStorage.removeItem('placementQuizCompleted');
    localStorage.removeItem('placementLevel');
    localStorage.removeItem('userToken_has_progress'); // Added in dashboard.js robustness checks
    window.location.href = 'login.html';
}
