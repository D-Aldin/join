const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const signBtn = document.querySelector("#signBtn");
const refLoginWindow = document.querySelector(".login_window");
const refSignWindow = document.querySelector(".sign_window");
const refSignUpSegment = document.querySelector(".sign_up");
const refBackButton = document.querySelector("#goBackArrow");
const pswConfirm = document.querySelector("#signUpConfirmPassword");
const psw = document.querySelector("#signUpPassword");
const signUpPasswordInput = document.getElementById("signUpPassword");
const toggleSignUpPassword = document.getElementById("toggleSignUpPassword");
const signUpConfirmPasswordInput = document.getElementById("signUpConfirmPassword");
const toggleSignUpConfirmPassword = document.getElementById("toggleSignUpConfirmPassword");
const inputIds = {
  name: "name",
  email: "signUpEmail",
  password: "signUpPassword",
  confirmPassword: "signUpConfirmPassword",
};
let refToUnderLineClass = document.querySelector(".under_line");
let user = [];
let newUser;
const colors = ["rgb(255, 122, 0)", "rgb(147, 39, 255)", "rgb(110, 82, 255)", "rgb(252, 113, 255)", "rgb(255, 187, 43)", "rgb(31, 215, 193)", "rgb(70, 47, 138)", "rgb(255, 70, 70)", "rgb(0, 190, 232)", "rgb(255, 122, 0)"];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function openSignUpModal() {
  refLoginWindow.style.animation = "fadeOut 125ms forwards";
  setTimeout(() => {
    refLoginWindow.style.display = "none";
    refSignUpSegment.style.display = "none";
    refSignWindow.style.display = "inline";
    refSignWindow.style.animation = "fadeIn 125ms forwards";
  }, 125);
}

function goBack() {
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

function getDataFromSignUp(event) {
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

function validateEachField(inputs) {
  let hasError = false;
  for (const key in inputs) {
    if (validateSingleField(key, inputs[key])) {
      hasError = true;
    }
  }
  return hasError;
}

function validateSingleField(key, value) {
  const errors = {
    name: "Please enter your name.",
    email: "Please enter your email address.",
    password: "Please enter your password.",
    confirmPassword: "Please confirm your password.",
  };
  const inputElement = document.getElementById(inputIds[key]);
  const errorElement = document.getElementById(`signUp_${key}_error`);
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

function showPasswordMismatchError() {
  document.getElementById("signUp_confirmPassword_error").innerText = "Passwords don't match. Please try again.";
  document.getElementById("signUpConfirmPassword").style.borderColor = "red";
}

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

function clearPrivacyPolicyError() {
  const errorElement = document.getElementById("signUp_privacy_error");
  if (errorElement) {
    errorElement.innerText = "";
  }
}

document.getElementById("signUp").addEventListener("submit", getDataFromSignUp);

document.addEventListener("click", function (event) {
  const signUpForm = document.querySelector("#signUp");
  if (signUpForm && !signUpForm.contains(event.target)) {
    clearSignUpErrorMessages();
  }
});

function clearSignUpErrorMessages() {
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

async function fetchUserContacts() {
  let response = await fetch(BASE_URL + `contacts.json`, { method: "GET" });
  return await response.json();
}

function checkIfUserExists(responseToJSON, email) {
  for (const key in responseToJSON) {
    if (responseToJSON[key].email === email) {
      return true;
    }
  }
  return false;
}

function displayEmailError() {
  document.getElementById("signUp_email_error").innerText = "This email is already registered.";
  document.getElementById("signUpEmail").style.borderColor = "red";
}

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
    toggleSignUpPassword.src = "./assets/icons/login_and_signUp/lock.svg";
  } else if (signUpPasswordInput.type === "password") {
    toggleSignUpPassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
  } else {
    toggleSignUpPassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  }
});

toggleSignUpPassword.addEventListener("click", () => {
  if (signUpPasswordInput.type === "password") {
    signUpPasswordInput.type = "text";
    toggleSignUpPassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  } else {
    signUpPasswordInput.type = "password";
    if (signUpPasswordInput.value.length === 0) {
      toggleSignUpPassword.src = "./assets/icons/login_and_signUp/lock.svg";
    } else {
      toggleSignUpPassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
    }
  }
});

signUpConfirmPasswordInput.addEventListener("input", () => {
  if (signUpConfirmPasswordInput.value.length === 0) {
    toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/lock.svg";
  } else if (signUpConfirmPasswordInput.type === "password") {
    toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
  } else {
    toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  }
});

toggleSignUpConfirmPassword.addEventListener("click", () => {
  if (signUpConfirmPasswordInput.type === "password") {
    signUpConfirmPasswordInput.type = "text";
    toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  } else {
    signUpConfirmPasswordInput.type = "password";
    if (signUpConfirmPasswordInput.value.length === 0) {
      toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/lock.svg";
    } else {
      toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
    }
  }
});
