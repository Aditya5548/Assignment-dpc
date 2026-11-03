const profileCard = document.querySelector("#profileCard");
const profileMessage = document.querySelector("#profileMessage");
const logoutButton = document.querySelector("#logoutButton");

function setMessage(element, message, type = "error") {
  element.textContent = message;
  element.className = "message " + type;
  element.hidden = !message;
}

function formatDate(value) {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

async function loadProfile() {
  try {
    const response = await fetch(window.APP_CONFIG.API_BASE_URL + "/api/auth/profile", {
      credentials: "include",
      headers: {
        "x-api-key": window.APP_CONFIG.API_KEY
      }
    });

    if (response.status === 401) {
      window.location.replace("/login.html");
      return;
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "The request could not be completed.");
    }

    if (!result.data) {
      throw new Error("Profile details not found.");
    }

    showProfile(result.data);
  } catch (error) {
    setMessage(profileMessage, error.message || "Unable to load profile.");
  }
}

function showProfile(user) {
  const name = user.fullName || "User";
  const email = user.email || "Not available";

  document.querySelector("#profileInitial").textContent = name.charAt(0).toUpperCase();
  document.querySelector("#profileName").textContent = name;
  document.querySelector("#profileEmail").textContent = email;
  document.querySelector("#profileNameDetail").textContent = name;
  document.querySelector("#profileEmailDetail").textContent = email;
  document.querySelector("#profilePhone").textContent = user.phone || "Not available";
  document.querySelector("#profileId").textContent = user.id || user._id || "Not available";
  document.querySelector("#profileCreatedAt").textContent = formatDate(user.createdAt);

  profileCard.hidden = false;
}

async function logout() {
  try {
    await fetch(window.APP_CONFIG.API_BASE_URL + "/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "x-api-key": window.APP_CONFIG.API_KEY
      }
    });
  } finally {
    window.location.replace("/login.html");
  }
}

logoutButton.addEventListener("click", logout);
loadProfile();