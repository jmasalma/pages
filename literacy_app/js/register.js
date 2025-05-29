document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target.username.value;
            const password = event.target.password.value;
            const confirmPassword = event.target.confirmPassword.value;

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message || "Registration successful! Please login.");
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || "Registration failed.");
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("An error occurred during registration.");
            }
        });
    }
});
