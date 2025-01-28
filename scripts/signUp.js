const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const signBtn = document.querySelector("#signBtn");
const refLoginWindow = document.querySelector(".login_window");
const refSignWindow = document.querySelector(".sign_window");
const refSignUpSegment = document.querySelector(".sign_up");
const refBackButton = document.querySelector("#goBackArrow");
const pswConfirm = document.querySelector("#signUpconfirmPassword");
const psw = document.querySelector("#signUppassword");
let refToUnderLineClass = document.querySelector(".under_line");
let user = [];
let newUser;

/**
 * Function to display the sign-up modal and hide the login modal.
 * @returns {void}
 */
function openSignUpModal() {
  refLoginWindow.style.display = "none";
  refSignUpSegment.style.display = "none";
  refSignWindow.style.display = "inline";
}

/**
 * Function to go back to the login window from the sign-up modal.
 * @returns {void}
 */
function goBack() {
  refLoginWindow.style.display = "inline";
  refSignUpSegment.style.display = "inline";
  refSignWindow.style.display = "none";
  document.querySelector("#name").value = "";
  document.querySelector("#signUpEmail").value = "";
  document.querySelector("#signUppassword").value = "";
  document.querySelector("#signUpconfirmPassword").value = "";
}

/**
 * Function to handle the form submission for signing up a new user.
 * It collects the user data, creates a new user object, and checks if the user already exists.
 *
 * @param {Event} event - The event triggered by form submission.
 * @returns {void}
 */
function getDataFromSignUp(event) {
  event.preventDefault();
  const form = event.target;
  const userEmail = form.email.value;
  const userName = form.name.value;
  const userPassword = form.password.value;
  const id = userEmail.split("@")[0].replace(".", "");
  newUser = userData(id, userEmail, userName, userPassword);
  ifUserAlreadyExists("users", "/" + id);
}

/**
 * Function to add new user data to the Firebase Realtime Database.
 *
 * @async
 * @param {string} path - The path in the database where the data will be stored.
 * @param {Object} data - The user data to be added.
 * @returns {Promise<Object>} The response object from the Firebase request.
 */
async function addUsersToDataBase(path = "", data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJSON = response.json();
  return responseToJSON;
}

/**
 * Function to create a new user object with the provided data.
 *
 * @param {string} id - The unique ID for the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} name - The name of the new user.
 * @param {string} password - The password for the new user.
 * @returns {Object} The user object to be added to the database.
 */
function userData(id, email, name, password) {
  return {
    [id]: {
      email: email,
      name: name,
      password: password,
    },
  };
}

/**
 * Function to check if a user already exists in the Firebase database by their ID.
 * If the user does not exist, the new user is added to the database.
 *
 * @async
 * @param {string} path - The path in the database where user data is stored.
 * @param {string} email - The ID of the user to check.
 * @returns {void}
 */
async function ifUserAlreadyExists(path = "", email = "") {
  let response = await fetch(BASE_URL + path + email + ".json", {
    method: "GET",
  });
  let responseToJSON = response.json();
  let result = await responseToJSON;
  if (result === null && pswConfirm.style.borderColor != "red") {
    console.log("User Dont Exists");
    addUsersToDataBase("users", newUser);
    window.location.href = "summary.html";
  } else {
    console.log("User Exists");
  }
}

/**
 * Function to check if the password and confirmation password match.
 * If they do not match, it shows an error message and changes the input border color to red.
 *
 * @returns {void}
 */
function passwordMatch() {
  const password = psw.value;
  const confitmPassword = pswConfirm.value;
  const confirmMsg = document.querySelector(".checkPassword");

  if (password.length == confitmPassword.length || password.length < confitmPassword.length) {
    if (confitmPassword !== password) {
      pswConfirm.style.borderColor = "red";
      confirmMsg.innerHTML = "Your passwords don't match. Please try again.";
    } else if (password == confitmPassword) {
      pswConfirm.style.borderColor = "#ccc";
      confirmMsg.innerHTML = "";
      document.getElementById("signUp").addEventListener("submit", getDataFromSignUp);
    }
  }
}

signBtn.addEventListener("click", openSignUpModal);
refBackButton.addEventListener("click", goBack);
pswConfirm.addEventListener("input", passwordMatch);
