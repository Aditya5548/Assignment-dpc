const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("formMessage");
const signupButton = document.getElementById("signupButton");

function setMessage(element, message, type = "error") {
  element.textContent = message;
  element.className = "message " + type;
  element.hidden = !message;
}

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

  signupButton.disabled = true;
  signupButton.textContent = "Please wait...";

  try {
    const response = await fetch(window.APP_CONFIG.API_BASE_URL + "/api/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "x-api-key": window.APP_CONFIG.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fullName, email, phone, password, confirmPassword })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "The request could not be completed.");
    }

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