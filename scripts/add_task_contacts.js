/**
 * Fetches and renders contacts from the database.
 * @param {string} path - The path in the Firebase database to fetch contacts from.
 * @returns {Promise<void>} A promise that resolves when contacts are rendered.
 */
async function renderContacts(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let contacts = await response.json();
  try {
    pushContacts(contacts);
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
  pushContactsToSelectField();
}

/**
 * Converts the raw contact data into an array of contact objects.
 * @param {Object} contacts - The raw contact data from Firebase.
 * @returns {void}
 */
function pushContacts(contacts) {
  for (let key in contacts) {
    let contact = {
      id: key,
      name: contacts[key].name,
      email: contacts[key].email,
      phone: contacts[key].phone,
      color: contacts[key].color,
    };
    arrayOfContacts.push(contact);
  }
}

/**
 * Renders contacts in the dropdown list.
 * @returns {void}
 */
function pushContactsToSelectField() {
  let contactlist = document.getElementById("contact-list");
  contactlist.innerHTML = "";
  for (let i = 0; i < arrayOfContacts.length; i++) {
    const currentContact = arrayOfContacts[i];
    renderContactTemplate(contactlist, currentContact, i);
  }
}

/**
 * Renders an individual contact item in the contact list dropdown.
 * @param {HTMLElement} contactlist - The container to append the contact to.
 * @param {Object} currentContact - The contact object to render.
 * @param {number} i - The index of the contact in the array.
 * @returns {void}
 */

/**
 * Filters and renders contacts based on search input.
 * @returns {void}
 */
function searchContacts() {
  let search = document.getElementById("contact-input").value.toLowerCase();
  let contactlist = document.getElementById("contact-list");
  contactlist.innerHTML = "";
  let current = arrayOfContacts.map((contact, index) => ({ ...contact, index })).filter((contact) => contact.name.toLowerCase().startsWith(search));
  for (let i = 0; i < current.length; i++) {
    let index = current[i].index;
    let currentContact = arrayOfContacts[index];
    renderContactTemplate(contactlist, currentContact, index);
  }
}

/**
 * Opens the contact list dropdown.
 * @returns {void}
 */
function openContactList() {
  let contactList = document.getElementById("contact-list");
  let inputBorder = document.getElementById("contact-input-border");
  let inputField = document.getElementById("contact-input-field");
  if (contactList.classList.contains("visible")) return closeContactList();
  document.getElementById("assigned").classList.add("display_none");
  inputBorder.classList.add("subtask-inputfield-focus");
  inputField.innerHTML = `<img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa.svg" alt="">`;
  contactList.classList.remove("display_none");
  if (contactFirstOpen) {
    void contactList.offsetWidth;
    contactFirstOpen = false;
  }
  showContactList(contactList);
}

/**
 * Shows the contact list dropdown with animation.
 * @param {HTMLElement} contactList - The contact list dropdown element.
 * @returns {void}
 */
function showContactList(contactList) {
  setTimeout(() => {
    contactList.classList.add("visible");
    document.addEventListener("click", handleContactOutsideClick);
  }, 10);
}

/**
 * Handles closing the contact list if clicked outside.
 * @param {Event} event - The event triggered by a click.
 * @returns {void}
 */
function handleContactOutsideClick(event) {
  let contactWrapper = document.getElementById("contact-wrapper");
  if (!contactWrapper.contains(event.target)) {
    closeContactList();
    document.removeEventListener("click", handleContactOutsideClick);
  }
}

/**
 * Closes the contact list dropdown.
 * @returns {void}
 */
function closeContactList() {
  let contactList = document.getElementById("contact-list");
  let inputBorder = document.getElementById("contact-input-border");
  let inputField = document.getElementById("contact-input-field");
  inputBorder.classList.remove("subtask-inputfield-focus");
  inputField.innerHTML = `<img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa (1).svg" alt="">`;
  contactList.classList.remove("visible");
  setTimeout(() => {
    contactList.classList.add("display_none");
    document.getElementById("contact-input").value = "";
    document.getElementById("assigned").classList.remove("display_none");
  }, 125);
  document.removeEventListener("click", handleContactOutsideClick);
}

/**
 * Adds or removes a contact from the selected contacts list.
 * @param {number} x - The index of the contact to add/remove.
 * @returns {void}
 */
function addContact(x) {
  event.stopPropagation();
  if (selectedContacts.includes(x)) {
    removeContact(x);
  } else {
    setContact(x);
  }
  renderSelectetContacts();
}

/**
 * Sets a contact as selected.
 * @param {number} x - The index of the contact to select.
 * @returns {void}
 */
function setContact(x) {
  let addContact = document.getElementById("contact" + x);
  addContact.classList.remove("contactlist");
  addContact.classList.add("contactlist-clicket");
  let box = document.getElementById("contact-checkbox" + x);
  box.innerHTML = `<img src="assets/icons/addTask/checkbox.svg" alt="">`;
  selectedContacts.push(x);
}

/**
 * Returns the first letter of the name in uppercase.
 * @param {string} name - The name from which to extract the first letter.
 * @returns {string} The first letter(s) of the name in uppercase.
 */
function returnFirstLetter(name) {
  let words = name.split(" ");
  let initialsArray = words.map(function (word) {
    let firstLetter = word.charAt(0).toUpperCase();
    return firstLetter;
  });
  let initials = initialsArray.join("");
  return initials;
}

/**
 * Removes a contact from the selected contacts list.
 * @param {number} x - The index of the contact to remove.
 * @returns {void}
 */
function removeContact(x) {
  let addContact = document.getElementById("contact" + x);
  addContact.classList.add("contactlist");
  addContact.classList.remove("contactlist-clicket");
  let box = document.getElementById("contact-checkbox" + x);
  box.innerHTML = `<img src="assets/icons/addTask/box.svg" alt="">`;
  const index = selectedContacts.indexOf(x);
  selectedContacts.splice(index, 1);
}

/**
 * Renders the selected contacts in the assigned area.
 * @returns {void}
 */
function renderSelectetContacts() {
  let wrapper = document.getElementById("assigned");
  wrapper.innerHTML = "";
  for (let i = 0; i < selectedContacts.length; i++) {
    const index = selectedContacts[i];
    wrapper.innerHTML += `<div class="contact-img-cyrcle" style="background-color: ${arrayOfContacts[index].color}">${returnFirstLetter(arrayOfContacts[index].name)}</div>`;
  }
}
