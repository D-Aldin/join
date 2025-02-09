BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
  setGreeting();
  setAccountInitialsSubmenu();
}

async function setGreeting() {
  let hour = new Date().getHours();
  let greeting;
  if (hour < 10) {
    greeting = "Good morning,";
  } else if (hour < 17) {
    greeting = "Good afternoon,";
  } else if (hour < 22) {
    greeting = "Good evening,";
  } else {
    greeting = "Good night,";
  }
  document.getElementById("time_message").innerHTML = greeting;
  let userName = await getUserName();
  document.querySelector(".account_name").innerHTML = userName;
}
