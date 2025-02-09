const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/users";
const refLoginButton = document.querySelector("#login_btn");
let email;
let password;

async function loginUser(email) {
  let response = await fetch(BASE_URL + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();

  for (const key in responseToJSON) {
    const emailFormDataBase = responseToJSON[key].email;
    const passwordFromDB = responseToJSON[key].password;
    if (emailFormDataBase == email && passwordFromDB == password) {
      localStorage.setItem("userId", key);
      window.location.href = "summary.html";
    } else {
      document.querySelector("#loginEmail").style.borderColor = "red";
      document.querySelector("#loginPassword").style.borderColor = "red";
      document.querySelector(".checkEmailPassword").innerHTML = "Check your email and password. Plase try again.";
    }
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
