const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("formMessage");
const loginButton = document.getElementById("loginButton");

// Do not show the login page to a user who already has a token.
if (getAuthToken()) {
    window.location.replace("/profile.html");
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(loginMessage, "");

    const formData = new FormData(loginForm);
    const email = formData.get("email").trim();
    const password = formData.get("password");

    loginButton.disabled = true;
    loginButton.textContent = "Please wait...";

    try {
        const result = await apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        if (!result.token) {
            throw new Error("Login response did not include an authentication token.");
        }

        localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
        window.location.replace("/profile.html");
    } catch (error) {
        setMessage(loginMessage, error.message || "Unable to log in. Please try again.");
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});
