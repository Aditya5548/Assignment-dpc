const profileCard = document.querySelector("#profileCard");
const profileMessage = document.querySelector("#profileMessage");
const logoutButton = document.querySelector("#logoutButton");

async function loadProfile() {
  if (!getAuthToken()) {
    redirectToLogin();
    return;
  }

  try {
    const response = await apiRequest("/api/auth/profile");
    const user = response.data;

    if (!user) {
      throw new Error("Profile details not found.");
    }

    showProfile(user);
  } catch (error) {
    const tokenErrors = [
      "TOKEN_EXPIRED",
      "TOKEN_INVALID",
      "TOKEN_MISSING",
      "TOKEN_USER_NOT_FOUND"
    ];

    if (!tokenErrors.includes(error.code)) {
      setMessage(profileMessage, error.message);
    }
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

function logout() {
  clearAuthToken();
  window.location.replace("/login.html");
}

logoutButton.addEventListener("click", logout);
loadProfile();
