const TOKEN_STORAGE_KEY = "authToken";

function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function redirectToLogin() {
  clearAuthToken();
  window.location.replace("/login.html");
}

async function apiRequest(endpoint, options = {}) {
  const headers = {
    "x-api-key": window.APP_CONFIG.API_KEY,
    ...options.headers
  };

  if (options.body && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(window.APP_CONFIG.API_BASE_URL + endpoint, {
      ...options,
      headers
    });
  } catch (error) {
    throw new Error("Unable to reach the server. Check your connection and try again.");
  }

  let result;

  try {
    result = await response.json();
  } catch (error) {
    throw new Error("The server returned an unexpected response.");
  }

  if (response.status === 401 && (
    result.code === "TOKEN_EXPIRED" ||
    result.code === "TOKEN_INVALID" ||
    result.code === "TOKEN_MISSING" ||
    result.code === "TOKEN_USER_NOT_FOUND"
  )) {
    redirectToLogin();
    throw new Error(result.message || "Please log in again.");
  }

  if (!response.ok) {
    const error = new Error(result.message || "The request could not be completed.");
    error.status = response.status;
    error.code = result.code;
    error.fields = result.errors || {};
    throw error;
  }

  return result;
}

function setMessage(element, message, type = "error") {
  if (!element) {
    return;
  }

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
