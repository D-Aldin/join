const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const refLoginButton = document.querySelector("#login_btn");
let email;
let password;

document.addEventListener("DOMContentLoaded", function () {
  const loginWindow = document.querySelector(".login_window");
  setTimeout(() => {
    loginWindow.style.display = "inline";
    loginWindow.style.animation = "fadeIn 1s forwards";
  }, 1000);
});

// TODO reduce lines of code
async function loginUser(email) {
  let response = await fetch(BASE_URL + "contacts.json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  let userFound = false;
  for (const key in responseToJSON) {
    const emailFromDatabase = responseToJSON[key].email;
    const passwordFromDB = responseToJSON[key].password;
    if (emailFromDatabase === email && passwordFromDB === password) {
      localStorage.setItem("userId", key);
      window.location.href = "summary.html";
      userFound = true;
      break;
    }
  }
  if (!userFound) {
    document.querySelector("#loginEmail").style.borderColor = "red";
    document.querySelector("#loginPassword").style.borderColor = "red";
    document.querySelector(".checkEmailPassword").innerHTML = "Check your email and password. Please try again.";
  }
}

function getDataFromLogin(event) {
  event.preventDefault();
  let email = document.getElementById("loginEmail").value;
  password = document.getElementById("loginPassword").value;
  loginUser(email);
}

document.querySelector("#guest_log").onclick = function () {
  localStorage.removeItem("userId");
  window.location.href = "summary.html";
};

refLoginButton.addEventListener("click", getDataFromLogin);

const passwordInput = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");

passwordInput.addEventListener("input", () => {
  if (passwordInput.value.length === 0) {
    togglePassword.src = "../assets/icons/signUp/lock.svg";
  } else if (passwordInput.type === "password") {
    togglePassword.src = "../assets/icons/signUp/visibility_off.svg";
  } else {
    togglePassword.src = "../assets/icons/signUp/visibility.svg";
  }
});

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.src = "../assets/icons/signUp/visibility.svg";
  } else {
    passwordInput.type = "password";
    if (passwordInput.value.length === 0) {
      togglePassword.src = "../assets/icons/signUp/lock.svg";
    } else {
      togglePassword.src = "../assets/icons/signUp/visibility_off.svg";
    }
  }
});
