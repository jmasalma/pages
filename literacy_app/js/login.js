document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target.username.value;
            const password = event.target.password.value;

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    if (data.token) {
                        localStorage.setItem('userToken', data.token);
                        localStorage.setItem('username', username); // Store username
                        alert("Login successful!");
                        window.location.href = 'dashboard.html';
                    } else {
                        alert(data.message || "Login failed: No token received.");
                    }
                } else {
                    alert(data.message || "Login failed.");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred during login.");
            }
        });
    }
});
