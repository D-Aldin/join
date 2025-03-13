/**
 * Module imports from signUp.js for handling sign-up functionality
 * @module signUpEventListener
 * @requires signUp
 */
import {
  openSignUpModal,
  goBack,
  passwordMatch,
  getDataFromSignUp,
  clearSignUpErrorMessages,
  refBackButton,
  pswConfirm,
  signUpPasswordInput,
  signUpConfirmPasswordInput,
  signBtn,
  toggleSignUpConfirmPassword,
  toggleSignUpPassword,
} from "./signUp.js";

/**
 * Event listener for opening the sign-up modal when the sign button is clicked
 * @listens click
 */
signBtn.addEventListener("click", openSignUpModal);

/**
 * Event listener for navigating back from the sign-up page
 * @listens click
 */
refBackButton.addEventListener("click", goBack);

/**
 * Event listener for validating password match during input
 * @listens input
 */
pswConfirm.addEventListener("input", passwordMatch);

/**
 * Event listener for form submission to process sign-up data
 * @listens submit
 */
document.getElementById("signUp").addEventListener("submit", getDataFromSignUp);

/**
 * Event listener for clearing error messages when clicking outside the sign-up form
 * @listens click
 */
document.addEventListener("click", function (event) {
  const signUpForm = document.querySelector("#signUp");
  if (signUpForm && !signUpForm.contains(event.target)) {
    clearSignUpErrorMessages();
  }
});

/**
 * Event listener that updates the password visibility toggle icon based on input state
 * @listens input
 */
signUpPasswordInput.addEventListener("input", () => {
  if (signUpPasswordInput.value.length === 0) {
    toggleSignUpPassword.src = "./assets/icons/login_and_signUp/lock.svg";
  } else if (signUpPasswordInput.type === "password") {
    toggleSignUpPassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
  } else {
    toggleSignUpPassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  }
});

/**
 * Event listener for toggling password visibility
 * @listens click
 */
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

/**
 * Event listener that updates the confirm password visibility toggle icon based on input state
 * @listens input
 */
signUpConfirmPasswordInput.addEventListener("input", () => {
  if (signUpConfirmPasswordInput.value.length === 0) {
    toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/lock.svg";
  } else if (signUpConfirmPasswordInput.type === "password") {
    toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/visibility_off.svg";
  } else {
    toggleSignUpConfirmPassword.src = "./assets/icons/login_and_signUp/visibility.svg";
  }
});

/**
 * Event listener for toggling confirm password visibility
 * @listens click
 */
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
