// Function to redirect to quiz if not completed (already defined from previous step)
function redirectToQuizIfNotCompleted() {
    if (!localStorage.getItem('placementQuizCompleted') && !localStorage.getItem('userToken_has_progress')) { // Second condition for robustness
        if (!window.location.pathname.includes('placement_quiz.html')) {
            // Check if user progress exists on backend before redirecting
            // This avoids redirect loop if localStorage is cleared but backend has progress
            const token = localStorage.getItem('userToken');
            if (token) {
                fetch(`${API_BASE_URL}/user_progress`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => response.json())
                .then(data => {
                    if (data && data.quiz_completed) {
                        localStorage.setItem('placementQuizCompleted', 'true');
                        localStorage.setItem('userToken_has_progress', 'true'); // Mark that backend has progress
                        // Refresh dashboard content
                        loadDashboardData();
                    } else {
                        // No progress on backend or quiz not completed
                        if (!window.location.pathname.includes('placement_quiz.html')) {
                             window.location.href = 'placement_quiz.html';
                        }
                    }
                })
                .catch(error => {
                    console.error("Error checking progress before redirect:", error);
                    // Fallback redirect if API call fails for some reason
                     if (!window.location.pathname.includes('placement_quiz.html')) {
                        window.location.href = 'placement_quiz.html';
                     }
                });
            } else {
                 // No token, should be handled by checkAuth, but as a fallback:
                 if (!window.location.pathname.includes('placement_quiz.html')) {
                    window.location.href = 'login.html';
                 }
            }
        }
    }
}

async function loadDashboardData() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.log("No token found, redirecting to login by checkAuth.");
        checkAuth(); // This will handle redirect if needed
        return;
    }

    const usernamePlaceholder = document.getElementById('usernamePlaceholder');
    const storedUsername = localStorage.getItem('username');
    if (usernamePlaceholder && storedUsername) {
        usernamePlaceholder.textContent = storedUsername;
    }

    const learningFocusEl = document.getElementById('currentCVCSet');
    const wordsMasteredEl = document.getElementById('wordsMastered');
    const startActivityButton = document.getElementById('startActivityButton');

    try {
        const response = await fetch(`${API_BASE_URL}/user_progress`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if(response.status === 401) {
                 checkAuth(); // Token might be invalid or expired
                 return;
            }
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user progress");
        }

        const progress = await response.json();

        if (progress.quiz_completed === false) {
            // This case should ideally be caught by redirectToQuizIfNotCompleted
            learningFocusEl.textContent = "Please complete the placement quiz.";
            wordsMasteredEl.textContent = "";
            startActivityButton.textContent = "Go to Placement Quiz";
            startActivityButton.onclick = () => { window.location.href = 'placement_quiz.html'; };
            localStorage.setItem('placementQuizCompleted', 'false'); // ensure local storage is correct
            redirectToQuizIfNotCompleted(); // Trigger redirect
            return;
        }
        
        localStorage.setItem('placementQuizCompleted', 'true'); // Ensure it's set if backend says so
        localStorage.setItem('userToken_has_progress', 'true');


        if (progress.current_cvc_set && progress.current_cvc_set.length > 0) {
            learningFocusEl.textContent = `Current CVC Word Set: ${progress.current_cvc_set.join(', ')}`;
            
            const totalWordsInSet = progress.current_cvc_set.length;
            const masteredWordsCount = progress.mastered_cvc_words ? progress.mastered_cvc_words.length : 0;
            wordsMasteredEl.textContent = `Words Mastered: ${masteredWordsCount} / ${totalWordsInSet}`;

            if (masteredWordsCount === totalWordsInSet) {
                startActivityButton.textContent = "All words mastered! Practice again or check for new sets.";
                startActivityButton.onclick = () => { window.location.href = 'activity_cvc.html'; }; // Still go to activity
                 learningFocusEl.innerHTML += "<br><strong>Congratulations! You've mastered this set.</strong>";
            } else {
                startActivityButton.textContent = "Start/Continue CVC Activity";
                startActivityButton.onclick = () => { window.location.href = 'activity_cvc.html'; };
            }

        } else {
            learningFocusEl.textContent = "No CVC word set assigned. This might be an issue.";
            wordsMasteredEl.textContent = "";
            startActivityButton.style.display = 'none'; // No activity to start
        }

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        if (learningFocusEl) learningFocusEl.textContent = "Could not load learning focus.";
        if (wordsMasteredEl) wordsMasteredEl.textContent = "Could not load progress.";
        // Optionally, redirect to login if there's a persistent auth issue
    }
}


document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // From auth.js - ensure user is logged in (redirects if not)
    
    // loadDashboardData will be called after checkAuth confirms token, 
    // and redirectToQuizIfNotCompleted will be called within loadDashboardData or before it.
    // For a cleaner flow:
    // 1. Check auth (redirects if no token)
    // 2. Check quiz completion (redirects if not done and no backend record)
    // 3. Load dashboard data
    
    // Revised flow:
    const token = localStorage.getItem('userToken');
    if(!token) { // If checkAuth hasn't redirected yet (it should)
        window.location.href = 'login.html';
        return;
    }

    // First, ensure quiz status is known before fully rendering dashboard
    // The redirectToQuizIfNotCompleted function now has more robust checks
    redirectToQuizIfNotCompleted(); 
    
    // Then load the main dashboard content
    loadDashboardData();


    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logoutUser(); // Assumes logoutUser is available (e.g., from auth.js)
        });
    }
});
