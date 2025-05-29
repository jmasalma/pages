// literacy_app/js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // checkAuth() will redirect to login.html if no active profile.
    // It's important it runs before trying to load dashboard specific content.
    if (!checkAuth()) { // From auth.js
        return; // Stop further execution if user is not authenticated / no profile
    }

    const usernamePlaceholder = document.getElementById('usernamePlaceholder');
    const learningFocusEl = document.getElementById('currentCVCSet');
    const wordsMasteredEl = document.getElementById('wordsMastered');
    const startActivityButton = document.getElementById('startActivityButton');
    const logoutButton = document.getElementById('logoutButton');

    function loadDashboardContent() {
        const userProfile = getUserProfile(); // from data_manager.js

        // Display Username
        if (usernamePlaceholder && userProfile.username) {
            usernamePlaceholder.textContent = userProfile.username;
        } else if (usernamePlaceholder) {
            usernamePlaceholder.textContent = "User"; // Fallback
        }

        // Check if quiz has been completed
        if (!userProfile.quizCompleted) {
            if (learningFocusEl) learningFocusEl.textContent = "Please complete the placement quiz to begin.";
            if (wordsMasteredEl) wordsMasteredEl.textContent = "";
            if (startActivityButton) {
                startActivityButton.textContent = "Go to Placement Quiz";
                startActivityButton.onclick = () => { window.location.href = 'placement_quiz.html'; };
            }
            // Optional: Redirect immediately if preferred
            // window.location.href = 'placement_quiz.html';
            return; // Stop further dashboard rendering until quiz is done
        }

        // Display Learning Focus and Progress
        if (userProfile.currentCVCSet && userProfile.currentCVCSet.length > 0) {
            if (learningFocusEl) {
                learningFocusEl.textContent = `Current CVC Word Set: ${userProfile.currentCVCSet.join(', ')}`;
            }
            
            const totalWordsInSet = userProfile.currentCVCSet.length;
            const masteredWordsCount = userProfile.masteredCVCWords ? userProfile.masteredCVCWords.length : 0;
            
            if (wordsMasteredEl) {
                wordsMasteredEl.textContent = `Words Mastered: ${masteredWordsCount} / ${totalWordsInSet}`;
            }

            if (startActivityButton) {
                if (masteredWordsCount === totalWordsInSet) {
                    startActivityButton.textContent = "All words mastered! Practice Again?";
                     if (learningFocusEl) learningFocusEl.innerHTML += "<br><strong>Congratulations! You've mastered this set.</strong>";
                } else {
                    startActivityButton.textContent = "Start/Continue CVC Activity";
                }
                startActivityButton.onclick = () => { window.location.href = 'activity_cvc.html'; };
            }

        } else {
            // Quiz completed, but no CVC set assigned (should not happen with current logic but good to handle)
            if (learningFocusEl) learningFocusEl.textContent = "No CVC word set assigned. Please try the placement quiz again.";
            if (wordsMasteredEl) wordsMasteredEl.textContent = "";
            if (startActivityButton) {
                startActivityButton.textContent = "Retake Placement Quiz";
                startActivityButton.onclick = () => {
                    // Clear quiz-related parts of profile before retake? Or let quiz overwrite.
                    // For now, just redirect. Quiz will overwrite.
                    window.location.href = 'placement_quiz.html';
                };
            }
        }
    }

    // Setup Logout Button
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logoutUser(); // from auth.js - this will clear data and redirect
        });
    }

    // Initial load of dashboard content
    loadDashboardContent();
});
