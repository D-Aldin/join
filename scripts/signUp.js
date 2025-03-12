const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const signBtn = document.querySelector("#signBtn");
const refLoginWindow = document.querySelector(".login_window");
const refSignWindow = document.querySelector(".sign_window");
const refSignUpSegment = document.querySelector(".sign_up");
export const refBackButton = document.querySelector("#goBackArrow");
export const pswConfirm = document.querySelector("#signUpConfirmPassword");
const psw = document.querySelector("#signUpPassword");
export const signUpPasswordInput = document.getElementById("signUpPassword");
const toggleSignUpPassword = document.getElementById("toggleSignUpPassword");
export const signUpConfirmPasswordInput = document.getElementById("signUpConfirmPassword");
const toggleSignUpConfirmPassword = document.getElementById("toggleSignUpConfirmPassword");

/**
 * Object mapping input field keys to their corresponding DOM element IDs.
 * @type {Object}
 */
const inputIds = {
  name: "name",
  email: "signUpEmail",
  password: "signUpPassword",
  confirmPassword: "signUpConfirmPassword",
};

/**
 * DOM element for the underline class element.
 * @type {HTMLElement}
 */
let refToUnderLineClass = document.querySelector(".under_line");

/**
 * Array to hold user information.
 * @type {Array}
 */
let user = [];

/**
 * New user data object.
 * @type {Object}
 */
let newUser;

/**
 * Array of color strings.
 * @type {string[]}
 */
const colors = ["rgb(255, 122, 0)", "rgb(147, 39, 255)", "rgb(110, 82, 255)", "rgb(252, 113, 255)", "rgb(255, 187, 43)", "rgb(31, 215, 193)", "rgb(70, 47, 138)", "rgb(255, 70, 70)", "rgb(0, 190, 232)", "rgb(255, 122, 0)"];

/**
 * Returns a random color from the predefined colors array.
 * @returns {string} A random RGB color string.
 */
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Opens the sign-up modal by fading out the login window and fading in the sign-up window.
 */
export function openSignUpModal() {
  refLoginWindow.style.animation = "fadeOut 125ms forwards";
  setTimeout(() => {
    refLoginWindow.style.display = "none";
    refSignUpSegment.style.display = "none";
    refSignWindow.style.display = "inline";
    refSignWindow.style.animation = "fadeIn 125ms forwards";
  }, 125);
}

/**
 * Returns the user to the login window by clearing sign-up inputs and applying fade animations.
 */
export function goBack() {
  refSignWindow.style.animation = "fadeOut 125ms forwards";
  const inputs = document.querySelectorAll("#signUp input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
  setTimeout(() => {
    refSignWindow.style.display = "none";
    refLoginWindow.style.display = "inline";
    refSignUpSegment.style.display = "inline";
    refLoginWindow.style.animation = "fadeIn 125ms forwards";
  }, 125);
}

/**
 * Handles sign-up form submission by collecting data, validating inputs,
 * and checking if the user already exists.
 * @param {Event} event - The submit event from the sign-up form.
 */
export function getDataFromSignUp(event) {
  event.preventDefault();
  const form = event.target;
  const userName = form.name.value;
  const userEmail = form.email.value;
  const userPassword = form.password.value;
  const confirmPassword = document.getElementById("signUpConfirmPassword").value;
  const privacyPolicy = document.getElementById("privacy_police").checked;
  if (validateSignUpInputs(userName, userEmail, userPassword, confirmPassword, privacyPolicy)) return;
  const id = userEmail.split("@")[0].replace(".", "") + "user";
  newUser = userData(id, userEmail, userName, userPassword);
  ifUserAlreadyExists(userEmail);
}

/**
 * Validates the sign-up form inputs.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - The confirmation of the password.
 * @param {boolean} privacyPolicy - Whether the privacy policy checkbox is checked.
 * @returns {boolean} Returns true if there are errors in the inputs.
 */
function validateSignUpInputs(name, email, password, confirmPassword, privacyPolicy) {
  const inputs = { name, email, password, confirmPassword };
  let hasError = validateEachField(inputs);
  if (password && confirmPassword && password !== confirmPassword) {
    showPasswordMismatchError();
    hasError = true;
  }
  if (!privacyPolicy) {
    showPrivacyPolicyError();
    hasError = true;
  } else {
    clearPrivacyPolicyError();
  }
  return hasError;
}

/**
 * Validates each field in the inputs object.
 * @param {Object} inputs - An object containing field names and their corresponding values.
 * @returns {boolean} Returns true if any field is invalid.
 */
function validateEachField(inputs) {
  let hasError = false;
  for (const key in inputs) {
    if (validateSingleField(key, inputs[key])) {
      hasError = true;
    }
  }
  return hasError;
}

/**
 * Validates a single input field by checking if it has a value.
 * @param {string} key - The key of the input field (name, email, etc.).
 * @param {string} value - The value of the input field.
 * @returns {boolean} Returns true if the field is invalid.
 */
function validateSingleField(key, value) {
  const errors = {
    name: "Please enter your name.",
    email: "Please enter your email address.",
    password: "Please enter your password.",
    confirmPassword: "Please confirm your password.",
  };
  const inputElement = document.getElementById(inputIds[key]);
  const errorElement = document.getElementById(`signUp_${key}_error`);
  return visibilityOfInputFields(key, value, inputElement, errorElement, errors);
}

/**
 * Sets error messages and border styles for input fields based on their values.
 * @param {string} key - The key of the input field.
 * @param {string} value - The value of the input field.
 * @param {HTMLElement} inputElement - The DOM element of the input.
 * @param {HTMLElement} errorElement - The DOM element for displaying the error.
 * @param {Object} errors - An object mapping keys to their corresponding error messages.
 * @returns {boolean} Returns true if the input is empty.
 */
function visibilityOfInputFields(key, value, inputElement, errorElement, errors) {
  if (!value) {
    errorElement.innerText = errors[key];
    inputElement.style.borderColor = "red";
    return true;
  } else {
    errorElement.innerText = "";
    inputElement.style.borderColor = "";
    return false;
  }
}

/**
 * Displays an error message indicating that the passwords do not match.
 */
function showPasswordMismatchError() {
  document.getElementById("signUp_confirmPassword_error").innerText = "Passwords don't match. Please try again.";
  document.getElementById("signUpConfirmPassword").style.borderColor = "red";
}

/**
 * Displays an error message if the privacy policy checkbox is not checked.
 */
function showPrivacyPolicyError() {
  let errorElement = document.getElementById("signUp_privacy_error");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = "signUp_privacy_error";
    errorElement.className = "error_message";
    document.querySelector(".privacy_police_content").parentNode.insertBefore(errorElement, document.querySelector(".privacy_police_content").nextSibling);
  }
  errorElement.innerText = "You must accept the Privacy Policy to continue.";
}

/**
 * Clears the error message related to the privacy policy.
 */
function clearPrivacyPolicyError() {
  const errorElement = document.getElementById("signUp_privacy_error");
  if (errorElement) {
    errorElement.innerText = "";
  }
}

/**
 * Clears all error messages and resets the border styles for sign-up form inputs.
 */
export function clearSignUpErrorMessages() {
  const errorFields = ["name", "email", "password", "confirmPassword"];
  for (const field of errorFields) {
    const errorElement = document.getElementById(`signUp_${field}_error`);
    if (errorElement) {
      errorElement.innerText = "";
    }
    const inputElement = document.getElementById(inputIds[field]);
    if (inputElement) {
      inputElement.style.borderColor = "";
    }
  }
  const privacyError = document.getElementById("signUp_privacy_error");
  if (privacyError) {
    privacyError.innerText = "";
  }
}

/**
 * Adds a new user to the database.
 * @async
 * @param {Object} data - The user data object to be stored.
 * @returns {Promise<Object>} The response parsed as JSON.
 */
async function addUsersToDataBase(data) {
  const uniqueKey = `user_${Date.now()}`;
  let response = await fetch(BASE_URL + `contacts/${uniqueKey}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

/**
 * Constructs a user data object.
 * @param {string} id - The user's unique identifier.
 * @param {string} email - The user's email.
 * @param {string} name - The user's name.
 * @param {string} password - The user's password.
 * @returns {Object} The constructed user data object.
 */
function userData(id, email, name, password) {
  return {
    name: name,
    email: email,
    password: password,
    phone: "",
    color: getRandomColor(),
  };
}

/**
 * Checks if a user already exists and if not, adds the user to the database.
 * @async
 * @param {string} email - The email to check for existence.
 */
async function ifUserAlreadyExists(email) {
  let responseToJSON = await fetchUserContacts();
  let userExists = checkIfUserExists(responseToJSON, email);
  if (!userExists && pswConfirm.style.borderColor !== "red") {
    console.log("User Doesn't Exist");
    await addUsersToDataBase(newUser);
    showOverlay();
  } else if (userExists) {
    displayEmailError();
  }
}

/**
 * Fetches the user contacts from the database.
 * @async
 * @returns {Promise<Object>} The JSON response containing user contacts.
 */
async function fetchUserContacts() {
  let response = await fetch(BASE_URL + `contacts.json`, { method: "GET" });
  return await response.json();
}

/**
 * Checks if a user exists in the database response based on the email.
 * @param {Object} responseToJSON - The JSON response containing user contacts.
 * @param {string} email - The email to check.
 * @returns {boolean} Returns true if a user with the email exists.
 */
function checkIfUserExists(responseToJSON, email) {
  for (const key in responseToJSON) {
    if (responseToJSON[key].email === email) {
      return true;
    }
  }
  return false;
}

/**
 * Displays an error message indicating that the email is already registered.
 */
function displayEmailError() {
  document.getElementById("signUp_email_error").innerText = "This email is already registered.";
  document.getElementById("signUpEmail").style.borderColor = "red";
}

/**
 * Checks if the password and confirmation password match and updates the UI accordingly.
 */
export function passwordMatch() {
  const password = psw.value;
  const confirmPassword = pswConfirm.value;
  const errorElement = document.getElementById("signUp_confirmPassword_error");
  if (confirmPassword !== password) {
    pswConfirm.style.borderColor = "red";
    if (errorElement) {
      errorElement.innerText = "Your passwords don't match. Please try again.";
    }
  } else {
    pswConfirm.style.borderColor = "#ccc";
    if (errorElement) {
      errorElement.innerText = "";
    }
  }
}

/**
 * Displays the overlay indicating a successful registration and triggers its animations.
 */
function showOverlay() {
  const overlay = document.getElementById("overlay");
  const message = document.querySelector(".overlay_msg");
  overlay.style.display = "block";
  overlay.style.opacity = "0";
  message.style.opacity = "1";
  requestAnimationFrame(() => {
    overlay.style.animation = "fadeIn 125ms ease-in-out forwards";
    message.style.animation = "slideInFromRight 125ms ease-in-out forwards";
    setTimeout(() => hideOverlay(), 1000);
  });
}

/**
 * Hides the overlay with animations and then redirects the user to the index page.
 */
function hideOverlay() {
  const overlay = document.getElementById("overlay");
  const message = document.querySelector(".overlay_msg");
  overlay.style.animation = "fadeOut 125ms ease-in-out forwards";
  message.style.animation = "slideOutToRight 125ms ease-in-out forwards";
  setTimeout(() => {
    overlay.style.display = "none";
    window.location.href = "index.html";
  }, 125);
}
