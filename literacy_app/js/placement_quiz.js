document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // From auth.js - ensure user is logged in

    const quizForm = document.getElementById('placementQuizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const answers = {
                q1: quizForm.elements['q1'].value,
                q2: quizForm.elements['q2'].value,
                q3: quizForm.elements['q3'].value,
                q4: quizForm.elements['q4'].value,
                q5: quizForm.elements['q5'].value,
            };

            // Basic validation: Ensure all questions are answered
            for (const q in answers) {
                if (!answers[q]) {
                    alert("Please answer all questions.");
                    return;
                }
            }

            try {
                const token = localStorage.getItem('userToken');
                const response = await fetch(`${API_BASE_URL}/submit_placement_quiz`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ answers }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || "Quiz submitted successfully! You will now be taken to your dashboard.");
                    // Store placement result or level if backend provides it
                    if(data.placement_level) {
                        localStorage.setItem('placementLevel', data.placement_level);
                    }
                    localStorage.setItem('placementQuizCompleted', 'true'); // Mark quiz as completed
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || "Failed to submit quiz.");
                }
            } catch (error) {
                console.error("Quiz submission error:", error);
                alert("An error occurred during quiz submission.");
            }
        });
    }
});

// Function to redirect to quiz if not completed (call this on dashboard load)
function redirectToQuizIfNotCompleted() {
    if (!localStorage.getItem('placementQuizCompleted')) {
        // Also check if user has actual placement data on backend if possible in future
        window.location.href = 'placement_quiz.html';
    }
}
