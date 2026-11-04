const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("formMessage");
const loginButton = document.getElementById("loginButton");

function setMessage(element, message, type = "error") {
  element.textContent = message;
  element.className = "message " + type;
  element.hidden = !message;
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
    const response = await fetch(window.APP_CONFIG.API_BASE_URL + "/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "x-api-key": window.APP_CONFIG.API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "The request could not be completed.");
    }

    window.location.replace("/profile.html");
  } 
  catch (error) {
    setMessage(loginMessage, error.message || "Unable to log in. Please try again.");
  } 
  finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});