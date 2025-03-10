/**
 * Sets the account initials in the submenu by retrieving the user's name
 * and extracting their initials to display in the account icon element.
 *
 * @async
 * @returns {Promise<void>} - A Promise that resolves when the initials are set
 */
async function setAccountInitialsSubmenu() {
  let userName = await getUserName();
  let initials = getInitialsSubmenu(userName);
  document.getElementById("account_icon").innerHTML = initials;
}

/**
 * Retrieves the user's name from the database using the stored user ID.
 * Falls back to "Guest" if the user ID is not available or user data can't be retrieved.
 *
 * @async
 * @returns {Promise<string>} A Promise that resolves to the user's name or "Guest"
 */
async function getUserName() {
  let userId = localStorage.getItem("userId");
  if (!userId) return "Guest";
  let response = await fetch(`${BASE_URL}contacts/${userId}.json`);
  let userData = await response.json();
  return userData.name || "Guest";
}

/**
 * Extracts initials from a name by taking the first character of each word.
 *
 * @param {string} name - The full name to extract initials from
 * @returns {string} The extracted initials (uppercase)
 */
function getInitialsSubmenu(name) {
  let words = name.split(" ");
  let initialsArray = words.map(function (word) {
    let firstLetter = word.charAt(0).toUpperCase();
    return firstLetter;
  });
  let initials = initialsArray.join("");
  return initials;
}
