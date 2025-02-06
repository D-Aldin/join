BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

let arrayOfContacts = [];
const colors = ["rgb(255, 122, 0)", "rgb(147, 39, 255)", "rgb(110, 82, 255)", "rgb(252, 113, 255)", "rgb(255, 187, 43)", "rgb(31, 215, 193)", "rgb(70, 47, 138)", "rgb(255, 70, 70)", "rgb(0, 190, 232)", "rgb(255, 122, 0)"];

async function init() {
  await getContactsFromDataBase();
  renderContacts();
}

async function addContactToDataBase() {
  let name = document.getElementById("add_name").value;
  let email = document.getElementById("add_email").value;
  let phone = document.getElementById("add_phone").value;
  let color = getRandomColor();
  const uniqueKey = `contact_${Date.now()}`;
  try {
    let response = await fetch(BASE_URL + `contacts/${uniqueKey}.json`, {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        color: color,
      }),
    });
    let contactData = await response.json();
    arrayOfContacts.push({ id: uniqueKey, ...contactData });
    renderContacts();
    closeOverlayAddContact();
    deleteInputs();
    return contactData;
  } catch (error) {
    console.error("Fehler:", error);
  }
}

async function getContactsFromDataBase() {
  let response = await fetch(BASE_URL + "contacts.json");
  let data = await response.json();
  arrayOfContacts = [];
  try {
    for (let key in data) {
      let contact = {
        id: key,
        name: data[key].name,
        email: data[key].email,
        phone: data[key].phone,
        color: data[key].color,
      };
      arrayOfContacts.push(contact);
    }
    return arrayOfContacts;
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

async function updateContactInDataBase(id) {
  let name = document.getElementById("edit_name").value;
  let email = document.getElementById("edit_email").value;
  let phone = document.getElementById("edit_phone").value;
  let contact = arrayOfContacts.find((c) => c.id === id);
  let color = contact.color;
  // console.log(BASE_URL + `contacts/${id}.json`);
  try {
    let response = await fetch(BASE_URL + `contacts/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone,
        color: color,
      }),
    });
    let contactData = await response.json();
    let index = arrayOfContacts.findIndex((contact) => contact.id === id);
    arrayOfContacts[index] = { id: id, ...contactData };
    renderContacts();
    closeOverlayEditContact();
    closeOverlayContactInfoAfterDelete();
    return contactData;
  } catch (error) {
    console.error("Fehler:", error);
  }
}

async function deleteContactFromList(id) {
  try {
    const response = await fetch(BASE_URL + `contacts/${id}.json`, {
      method: "DELETE",
    });
    arrayOfContacts = arrayOfContacts.filter((contact) => contact.id !== id);
    renderContacts();
    closeOverlayEditContact();
    closeOverlayContactInfoAfterDelete();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

function closeOverlayContactInfoAfterDelete() {
  let overlay = document.getElementById("overlay_contact_infos");
  overlay.style.animation = "slideOutToRightContactInfos 0.3s forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
    },
    { once: true }
  );
}

function deleteInputs() {
  let inputs = document.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function renderContacts() {
  let contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";
  arrayOfContacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
  let renderedLetters = [];
  for (let i = 0; i < arrayOfContacts.length; i++) {
    let contact = arrayOfContacts[i];
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (renderedLetters.indexOf(firstLetter) === -1) {
      contactList.innerHTML += getLetterTemplate(firstLetter);
      renderedLetters.push(firstLetter);
    }
    contactList.innerHTML += getContactTemplate(contact, i);
    let initials = getInitials(contact.name);
    let circleElement = document.getElementById(`circle_${i}`);
    circleElement.innerText = initials;
    circleElement.style.backgroundColor = contact.color;
  }
}

function getInitials(name) {
  let words = name.split(" ");
  let initialsArray = words.map(function (word) {
    let firstLetter = word.charAt(0).toUpperCase();
    return firstLetter;
  });
  let initials = initialsArray.join("");
  return initials;
}

function openOverlayAddContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_add_contact_card");
  overlayRef.classList.add("overlay_background");
  overlayCardRef.classList.add("overlay_add_contact_card");
  overlayCardRef.style.animation = "slideInFromRightAddContact 0.3s forwards";
}

function openOverlayEditContact(contactId) {
  let contact = arrayOfContacts.find((c) => c.id === contactId);
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayEditCardRef = document.getElementById("overlay_edit_contact_card");
  overlayEditCardRef.innerHTML = getTemplateOfContactEdit(contact);
  overlayRef.classList.add("overlay_background");
  overlayEditCardRef.classList.add("overlay_edit_contact_card");
  overlayEditCardRef.style.animation = "slideInFromRightAddContact 0.3s forwards";
}

function closeOverlayAddContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_add_contact_card");
  overlayRef.style.backgroundColor = "transparent";
  overlayCardRef.style.animation = "slideOutToRightAddContact 0.3s forwards";
  overlayCardRef.addEventListener(
    "animationend",
    () => {
      overlayRef.classList.remove("overlay_background");
      overlayCardRef.classList.remove("overlay_add_contact_card");
      overlayCardRef.style.animation = "";
      overlayRef.style.backgroundColor = "";
      deleteInputs();
    },
    { once: true }
  );
}

function overlayContactSuccessfullyCreated() {
  let overlayRef = document.getElementById("contact_successfully_created");
  overlayRef.classList.remove("d_none");
  overlayRef.classList.add("overlay_contact_successfully_created");
  overlayRef.style.animation = "slideInFromRightContactSuccessfullyCreated 0.3s forwards";
  setTimeout(() => {
    overlayRef.style.animation = "slideOutToRightContactSuccessfullyCreated 0.3s forwards";
  }, 800);
}

function setTimeoutSuccessfullyOverlay() {
  setTimeout(() => {
    overlayContactSuccessfullyCreated();
  }, 400);
}

function closeOverlayEditContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_edit_contact_card");
  overlayRef.style.backgroundColor = "transparent";
  overlayCardRef.style.animation = "slideOutToRightAddContact 0.3s forwards";
  overlayCardRef.addEventListener(
    "animationend",
    () => {
      overlayRef.classList.remove("overlay_background");
      overlayCardRef.classList.remove("overlay_edit_contact_card");
      overlayCardRef.style.animation = "";
      overlayRef.style.backgroundColor = "";
    },
    { once: true }
  );
}

function toggleOverlayContactInfos(index) {
  let overlay = document.getElementById("overlay_contact_infos");
  let contactElement = document.getElementById(`contact_${index}`);
  let contact = arrayOfContacts[index];
  if (contactElement.classList.contains("contact_active")) {
    ifContactElementContainsContactActive(overlay, contactElement);
  } else {
    removeActiveClassFromContacts();
    elseContactElementContainsContactActive(overlay, contactElement, contact);
  }
}

function removeActiveClassFromContacts() {
  const activeContacts = document.querySelectorAll(".contact_active");
  for (let i = 0; i < activeContacts.length; i++) {
    activeContacts[i].classList.remove("contact_active");
    activeContacts[i].classList.add("hover_contact_list");
  }
}

function ifContactElementContainsContactActive(overlay, contactElement) {
  contactElement.classList.remove("contact_active");
  contactElement.classList.add("hover_contact_list");
  overlay.style.animation = "slideOutToRightContactInfos 0.3s forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
    },
    { once: true }
  );
}

function elseContactElementContainsContactActive(overlay, contactElement, contact) {
  contactElement.classList.add("contact_active");
  contactElement.classList.remove("hover_contact_list");
  overlay.innerHTML = getTemplateOfContactInfo(contact);
  if (overlay.classList.contains("d_none")) {
    overlay.classList.remove("d_none");
    overlay.style.animation = "slideInFromRightContactInfos 0.3s forwards";
  } else {
    elseOverlayContactInfosGoOut(overlay, contact);
  }
}

function elseOverlayContactInfosGoOut(overlay, contact) {
  overlay.style.animation = "slideOutToRightContactInfos 0.3s forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
      overlay.innerHTML = getTemplateOfContactInfo(contact);
      overlay.classList.remove("d_none");
      overlay.style.animation = "slideInFromRightContactInfos 0.3s forwards";
    },
    { once: true }
  );
}
