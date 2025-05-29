// literacy_app/js/placement_quiz.js

document.addEventListener('DOMContentLoaded', () => {
    // checkAuth() from auth.js should be called on any page requiring login.
    // If placement_quiz.html is accessed directly, ensure user is "logged in" (has a profile).
    if (!checkAuth()) { // checkAuth redirects if not logged in and not on login.html
        // If checkAuth determined a redirect is needed but hasn't done it yet
        // (e.g. if login.html is the one that should handle it),
        // it might be good to prevent quiz form listeners from being added.
        // However, checkAuth itself should redirect away from here if no active profile.
        return; 
    }

    const quizForm = document.getElementById('placementQuizForm');
    if (!quizForm) {
        console.error("Placement quiz form not found!");
        return;
    }

    // Define Quiz Questions and Correct Answers (Client-Side)
    // These keys should match the 'value' attributes of the correct radio buttons in placement_quiz.html
    const QUIZ_KEY = {
        q1: 'cat_pic_correct', // Word: CAT
        q2: 'sun_pic_correct', // Word: SUN
        q3: 'pin_pic_correct', // Word: PIN
        q4: 'top_pic_correct', // Word: TOP
        q5: 'bug_pic_correct'  // Word: BUG
    };
    const TOTAL_QUESTIONS = Object.keys(QUIZ_KEY).length;

    quizForm.addEventListener('submit', async (event) => { // 'async' can be removed if no await inside
        event.preventDefault();
        
        let answeredQuestions = 0;
        let correctAnswers = 0;
        const userAnswers = {};

        // Collect and score answers
        for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
            const questionName = 'q' + i;
            if (quizForm.elements[questionName] && quizForm.elements[questionName].value) {
                userAnswers[questionName] = quizForm.elements[questionName].value;
                answeredQuestions++;
                if (userAnswers[questionName] === QUIZ_KEY[questionName]) {
                    correctAnswers++;
                }
            }
        }

        if (answeredQuestions < TOTAL_QUESTIONS) {
            alert("Please answer all questions.");
            return;
        }

        // Determine placement level based on score (logic from original app.py)
        let placementLevelResult = "CVC_Level_1_Beginner"; // Default
        
        if (correctAnswers >= 4) { // e.g. 4 or 5 correct
            placementLevelResult = "CVC_Level_2_Intermediate";
        } else if (correctAnswers >= 2) { // e.g. 2 or 3 correct
            placementLevelResult = "CVC_Level_1_Review";
        }
        // else stays CVC_Level_1_Beginner (already set)

        // Get current user profile
        const userProfile = getUserProfile(); // from data_manager.js
        if (!userProfile.isLoggedIn) {
            alert("No active user profile. Please go back and set up your profile.");
            window.location.href = 'login.html'; // Redirect to profile setup
            return;
        }

        // Update profile with quiz results
        userProfile.quizCompleted = true;
        userProfile.placementLevel = placementLevelResult;
        userProfile.currentCVCSet = getCVCSetForLevel(placementLevelResult); // from data_manager.js
        userProfile.masteredCVCWords = []; // Reset mastered words for the new level/set

        saveUserProfile(userProfile); // from data_manager.js

        alert(`Quiz submitted! You got ${correctAnswers} out of ${TOTAL_QUESTIONS} correct. Your starting level is: ${placementLevelResult}. You will now be taken to your dashboard.`);
        
        // No longer need to store placementQuizCompleted or placementLevel separately in localStorage,
        // as they are part of the userProfile object saved by saveUserProfile.
        // localStorage.setItem('placementQuizCompleted', 'true'); // Old way
        // localStorage.setItem('placementLevel', placementLevelResult); // Old way

        window.location.href = 'dashboard.html';
    });
});

// The function `redirectToQuizIfNotCompleted` is now primarily handled by dashboard.js,
// which checks the userProfile from data_manager.js.
// So, this file (placement_quiz.js) doesn't need to define it anymore.
