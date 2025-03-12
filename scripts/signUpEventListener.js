import { openSignUpModal, goBack, passwordMatch, getDataFromSignUp, clearSignUpErrorMessages, refBackButton, pswConfirm, signUpPasswordInput, signUpConfirmPasswordInput } from "./signUp.js";

signBtn.addEventListener("click", openSignUpModal);
refBackButton.addEventListener("click", goBack);
pswConfirm.addEventListener("input", passwordMatch);

document.getElementById("signUp").addEventListener("submit", getDataFromSignUp);

document.addEventListener("click", function (event) {
  const signUpForm = document.querySelector("#signUp");
  if (signUpForm && !signUpForm.contains(event.target)) {
    clearSignUpErrorMessages();
  }
});

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
