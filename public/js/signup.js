const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("formMessage");
const signupButton = document.getElementById("signupButton");

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    setMessage(signupMessage, "");

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        setMessage(signupMessage, "Password and confirm password do not match.");
        document.getElementById("confirmPassword").focus();
        return;
    }

    const userData = {
        fullName,
        email,
        phone,
        password,
        confirmPassword
    };

    signupButton.disabled = true;
    signupButton.textContent = "Please wait...";

    try {
        const result = await apiRequest("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(userData)
        });

        signupForm.reset();
        setMessage(
            signupMessage,
            result.message || "Account created successfully.",
            "success"
        );

        setTimeout(function () {
            window.location.replace("/login.html");
        }, 1200);
    } catch (error) {
        setMessage(signupMessage, error.message);
    } finally {
        signupButton.disabled = false;
        signupButton.textContent = "Create Account";
    }
});
