const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/users";
const refLoginButton = document.querySelector("#login_btn");
let email;
let password;

/**
 * Function to handle user login. It checks the provided email and password
 * against the data stored in Firebase Realtime Database.
 * If the credentials match, the user is redirected to 'index.html'.
 * If not, it displays an error message and highlights the input fields in red.
 *
 * @param {string} email - The email entered by the user in the login form.
 */
async function loginUser(email) {
  let response = await fetch(BASE_URL + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();

  for (const key in responseToJSON) {
    const emailFormDataBase = responseToJSON[key].email;
    const passwordFromDB = responseToJSON[key].password;
    if (emailFormDataBase == email && passwordFromDB == password) {
      window.location.href = "index.html";
    } else {
      document.querySelector("#loginEmail").style.borderColor = "red";
      document.querySelector("#loginPassword").style.borderColor = "red";
      document.querySelector(".checkEmailPassword").innerHTML = "Check your email and password. Plase try again.";
    }
  }
}

/**
 * Function to retrieve the email and password from the login form and
 * call the loginUser function to check the credentials.
 *
 * @param {Event} event - The event triggered when the login button is clicked.
 */
function getDataFromLogin(event) {
  event.preventDefault();
  let email = document.getElementById("loginEmail").value;
  password = document.getElementById("loginPassword").value;
  loginUser(email);
}

document.querySelector("#guest_log").onclick = function () {
  window.location.href = "summary.html";
};
