/**
 * The base URL for the Firebase database.
 * @const {string}
 */
const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Reference to the login button element.
 * @const {HTMLElement}
 */
const refLoginButton = document.querySelector("#login_btn");

/**
 * Reference to the password input element.
 * @const {HTMLInputElement}
 */
const passwordInput = document.getElementById("loginPassword");

/**
 * Reference to the toggle password icon element.
 * @const {HTMLImageElement}
 */
const togglePassword = document.getElementById("togglePassword");

/**
 * User's email address.
 * @type {string}
 */
let email;

/**
 * User's password.
 * @type {string}
 */
let password;

/**
 * Initializes the login page by displaying elements with animations.
 * @listens {DOMContentLoaded}
 */
document.addEventListener("DOMContentLoaded", function () {
  const loginWindow = document.querySelector(".login_window");
  const loginHeader = document.querySelector(".login_header");
  const footer = document.querySelector("footer");
  setTimeout(() => {
    footer.style.display = "block";
    footer.style.animation = "fadeIn 1s forwards";
    loginHeader.style.display = "flex";
    loginHeader.style.animation = "fadeIn 1s forwards";
    loginWindow.style.display = "inline";
    loginWindow.style.animation = "fadeIn 1s forwards";
  }, 1000);
});

/**
 * Authenticates the user by email.
 * @async
 * @param {string} email - The user's email address.
 */
async function loginUser(email) {
  let responseToJSON = await fetchUserData();
  let userKey = findUserByEmail(responseToJSON, email);
  if (userKey) {
    authenticateUser(userKey);
  }
}

/**
 * Fetches user data from the Firebase database.
 * @async
 * @returns {Promise<Object>} The user data from the Firebase database.
 */
async function fetchUserData() {
  let response = await fetch(BASE_URL + "contacts.json", { method: "GET" });
  return await response.json();
}

/**
 * Finds the user by email in the provided user data.
 * @param {Object} users - The user data.
 * @param {string} email - The email to search for.
 * @returns {string|null} The user key if found, or null if not found.
 */
function findUserByEmail(users, email) {
  for (const key in users) {
    if (users[key].email === email && users[key].password === password) {
      return key;
    }
  }
  return null;
}

/**
 * Authenticates the user by storing their user key in localStorage.
 * Redirects the user to the summary page.
 * @param {string} userKey - The key of the user.
 */
function authenticateUser(userKey) {
  localStorage.setItem("userId", userKey);
  localStorage.removeItem("isGuest");
  window.location.href = "summary.html";
}

/**
 * Event listener for the login button click.
 * Calls the getDataFromLogin function.
 * @listens {click}
 */
refLoginButton.addEventListener("click", getDataFromLogin);

/**
 * Initializes the guest login button functionality.
 * @listens {DOMContentLoaded}
 */
document.addEventListener("DOMContentLoaded", function () {
  const guestLogButton = document.querySelector("#guest_log");
  if (guestLogButton) {
    guestLogButton.onclick = function () {
      localStorage.setItem("userId", "guest");
      window.location.href = "summary.html";
    };
  }
});

/**
 * Event listener for password input changes.
 * Changes the toggle password icon based on the input type.
 * @listens {input}
 */
passwordInput.addEventListener("input", () => {
  if (passwordInput.value.length === 0) {
    togglePassword.src = "./assets/icons/login_and_signUp/lock.svg";
  } else if (passwordInput.type === "password") {
    togglePassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
  } else {
    togglePassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  }
});

/**
 * Toggles the visibility of the password input field.
 * @listens {click}
 */
togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  } else {
    passwordInput.type = "password";
    if (passwordInput.value.length === 0) {
      togglePassword.src = "./assets/icons/login_and_signUp/lock.svg";
    } else {
      togglePassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
    }
  }
});

/**
 * Retrieves the data from the login form and triggers user authentication.
 * @param {Event} event - The event triggered by the login button click.
 */
function getDataFromLogin(event) {
  event.preventDefault();
  email = document.getElementById("loginEmail").value;
  password = document.getElementById("loginPassword").value;
  if (validateLoginInputs(email, password)) return;
  loginUser(email);
}

/**
 * Validates the email and password inputs.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {boolean} Returns true if there is an error, false otherwise.
 */
function validateLoginInputs(email, password) {
  const inputs = { email, password };
  const inputIds = { email: "loginEmail", password: "loginPassword" };
  const errors = {
    email: "Please enter your email address here.",
    password: "Please enter your password here.",
  };
  let hasError = false;
  for (const key in inputs) {
    const value = inputs[key];
    const inputElement = document.getElementById(inputIds[key]);
    if (loginInputsBehaviour(value, key, errors, inputElement)) {
      hasError = true;
    }
  }
  return hasError;
}

/**
 * Handles the behaviour of the login input fields during validation.
 * @param {string} value - The input value.
 * @param {string} key - The key of the input field ('email' or 'password').
 * @param {Object} errors - The error messages for each input field.
 * @param {HTMLElement} inputElement - The input element.
 * @returns {boolean} Returns true if the input is invalid, false otherwise.
 */
function loginInputsBehaviour(value, key, errors, inputElement) {
  if (!value) {
    document.getElementById(`${key}_error`).innerText = errors[key];
    inputElement.style.borderColor = "red";
    return true;
  } else {
    document.getElementById(`${key}_error`).innerText = "";
    inputElement.style.borderColor = "";
    return false;
  }
}

/**
 * Clears error messages when clicking outside the login form.
 * @listens {click}
 */
document.addEventListener("click", function (event) {
  if (!document.querySelector(".form_content").contains(event.target)) {
    clearErrorMessages();
  }
});

/**
 * Clears the error messages for the email and password fields.
 */
function clearErrorMessages() {
  document.getElementById("email_error").innerText = "";
  document.getElementById("password_error").innerText = "";
  document.getElementById("loginEmail").style.borderColor = "";
  document.getElementById("loginPassword").style.borderColor = "";
}
