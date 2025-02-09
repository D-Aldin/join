const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

async function setAccountInitialsSubmenu() {
  let userName = await getUserName();
  let initials = getInitialsSubmenu(userName);
  document.getElementById("account_icon").innerHTML = initials;
}

async function getUserName() {
  let userId = localStorage.getItem("userId");
  if (!userId) return "Guest";
  let response = await fetch(`${BASE_URL}users/${userId}.json`);
  let userData = await response.json();
  return userData.name || "Guest";
}

function getInitialsSubmenu(name) {
  let words = name.split(" ");
  let initialsArray = words.map(function (word) {
    let firstLetter = word.charAt(0).toUpperCase();
    return firstLetter;
  });
  let initials = initialsArray.join("");
  return initials;
}
