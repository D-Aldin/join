const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const signBtn = document.querySelector("#signBtn");
const refLoginWindow = document.querySelector(".login_window");
const refSignWindow = document.querySelector(".sign_window");
const refSignUpSegment = document.querySelector(".sign_up");
const refBackButton = document.querySelector("#goBackArrow");
const pswConfirm = document.querySelector("#signUpconfirmPassword");
const psw = document.querySelector("#signUppassword");
const signUpPasswordInput = document.getElementById("signUppassword");
const toggleSignUpPassword = document.getElementById("toggleSignUpPassword");
const signUpConfirmPasswordInput = document.getElementById("signUpconfirmPassword");
const toggleSignUpConfirmPassword = document.getElementById("toggleSignUpConfirmPassword");
let refToUnderLineClass = document.querySelector(".under_line");
let user = [];
let newUser;
const colors = ["rgb(255, 122, 0)", "rgb(147, 39, 255)", "rgb(110, 82, 255)", "rgb(252, 113, 255)", "rgb(255, 187, 43)", "rgb(31, 215, 193)", "rgb(70, 47, 138)", "rgb(255, 70, 70)", "rgb(0, 190, 232)", "rgb(255, 122, 0)"];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * Function to display the sign-up modal and hide the login modal.
 * @returns {void}
 */
function openSignUpModal() {
  refLoginWindow.style.animation = "fadeOut 1s forwards";
  setTimeout(() => {
    refLoginWindow.style.display = "none";
    refSignUpSegment.style.display = "none";
    refSignWindow.style.display = "inline";
    refSignWindow.style.animation = "fadeIn 1s forwards";
  }, 125);
}

/**
 * Function to go back to the login window from the sign-up modal.
 * @returns {void}
 */
function goBack() {
  refSignWindow.style.animation = "fadeOut 1s forwards";
  setTimeout(() => {
    refSignWindow.style.display = "none";
    refLoginWindow.style.display = "inline";
    refSignUpSegment.style.display = "inline";
    refLoginWindow.style.animation = "fadeIn 1s forwards";
  }, 125);
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
  const id = userEmail.split("@")[0].replace(".", "") + "user";
  newUser = userData(id, userEmail, userName, userPassword);
  ifUserAlreadyExists(userEmail);
}

/**
 * Function to add new user data to the Firebase Realtime Database.
 *
 * @async
 * @param {Object} data - The user data to be added.
 * @returns {Promise<Object>} The response object from the Firebase request.
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
  // youSignedUp();
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
    name: name,
    email: email,
    password: password,
    phone: "",
    color: getRandomColor(),
  };
}

async function ifUserAlreadyExists(email) {
  let response = await fetch(BASE_URL + `contacts.json`, {
    method: "GET",
  });
  let responseToJSON = await response.json();
  let userExists = false;
  for (const key in responseToJSON) {
    if (responseToJSON[key].email === email) {
      userExists = true;
      break;
    }
  }
  if (!userExists && pswConfirm.style.borderColor != "red") {
    console.log("User Don't Exist");
    await addUsersToDataBase(newUser);
    showOverlay();
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

  if (password.length == confitmPassword.length || password.length < confitmPassword.length || password.length > confitmPassword.length) {
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

function showOverlay() {
  let overlay = document.getElementById("overlay");
  overlay.classList.add("show");
  setTimeout(() => {
    overlay.classList.remove("show");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 500);
  }, 1000);
}

signUpPasswordInput.addEventListener("input", () => {
  if (signUpPasswordInput.value.length === 0) {
    toggleSignUpPassword.src = "./assets/icons/signUp/lock.svg";
  } else if (signUpPasswordInput.type === "password") {
    toggleSignUpPassword.src = "./assets/icons/signUp/visibility_off.svg";
  } else {
    toggleSignUpPassword.src = "./assets/icons/signUp/visibility.svg";
  }
});

toggleSignUpPassword.addEventListener("click", () => {
  if (signUpPasswordInput.type === "password") {
    signUpPasswordInput.type = "text";
    toggleSignUpPassword.src = "./assets/icons/signUp/visibility.svg";
  } else {
    signUpPasswordInput.type = "password";
    if (signUpPasswordInput.value.length === 0) {
      toggleSignUpPassword.src = "./assets/icons/signUp/lock.svg";
    } else {
      toggleSignUpPassword.src = "./assets/icons/signUp/visibility_off.svg";
    }
  }
});

signUpConfirmPasswordInput.addEventListener("input", () => {
  if (signUpConfirmPasswordInput.value.length === 0) {
    toggleSignUpConfirmPassword.src = "./assets/icons/signUp/lock.svg";
  } else if (signUpConfirmPasswordInput.type === "password") {
    toggleSignUpConfirmPassword.src = "./assets/icons/signUp/visibility_off.svg";
  } else {
    toggleSignUpConfirmPassword.src = "./assets/icons/signUp/visibility.svg";
  }
});

toggleSignUpConfirmPassword.addEventListener("click", () => {
  if (signUpConfirmPasswordInput.type === "password") {
    signUpConfirmPasswordInput.type = "text";
    toggleSignUpConfirmPassword.src = "./assets/icons/signUp/visibility.svg";
  } else {
    signUpConfirmPasswordInput.type = "password";
    if (signUpConfirmPasswordInput.value.length === 0) {
      toggleSignUpConfirmPassword.src = "./assets/icons/signUp/lock.svg";
    } else {
      toggleSignUpConfirmPassword.src = "./assets/icons/signUp/visibility_off.svg";
    }
  }
});
