BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

let arrayOfContacts = [];
const colors = ["rgb(255, 122, 0)", "rgb(147, 39, 255)", "rgb(110, 82, 255)", "rgb(252, 113, 255)", "rgb(255, 187, 43)", "rgb(31, 215, 193)", "rgb(70, 47, 138)", "rgb(255, 70, 70)", "rgb(0, 190, 232)", "rgb(255, 122, 0)"];

async function init() {
  await getContactsFromDataBase();
  renderContacts();
}

let input = document.querySelector("input");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("create_contact_enter").click();
  }
});

async function addContactToDataBase() {
  let name = document.getElementById("add_name").value;
  let email = document.getElementById("add_email").value;
  let phone = document.getElementById("add_phone").value;
  if (validateContactInputs(name, email, phone)) return;
  let color = getRandomColor();
  const uniqueKey = `contact_${Date.now()}`;
  try {
    let response = await fetch(BASE_URL + `contacts/${uniqueKey}.json`, {
      method: "PUT",
      body: JSON.stringify({ name, email, phone, color }),
    });
    let contactData = await response.json();
    arrayOfContacts.push({ id: uniqueKey, ...contactData });
    renderContacts();
    closeOverlayAddContact();
    deleteInputs();
    setTimeoutSuccessfullyOverlayAddContact();
    return contactData;
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function validateContactInputs(name, email, phone) {
  const inputs = { name, email, phone };
  const inputIds = { name: "add_name", email: "add_email", phone: "add_phone" };
  const errors = {
    name: "Please enter your first and last name here.",
    email: "Please enter your email address here.",
    phone: "Please enter your phone number here.",
  };
  let hasError = false;
  for (const key in inputs) {
    const value = inputs[key];
    const inputElement = document.getElementById(inputIds[key]);
    if (!value) {
      document.getElementById(`${key}_error`).innerText = errors[key];
      inputElement.style.borderColor = "red";
      hasError = true;
    } else {
      document.getElementById(`${key}_error`).innerText = "";
      inputElement.style.borderColor = "";
    }
  }
  return hasError;
}

document.addEventListener("click", function (event) {
  if (!document.querySelector(".form_input_fields_position").contains(event.target)) {
    clearErrorMessages();
  }
});

document.querySelector(".btn_cancel").addEventListener("click", clearErrorMessages);
document.querySelector(".overlay_close_btn_position img").addEventListener("click", clearErrorMessages);

function clearErrorMessages() {
  document.getElementById("name_error").innerText = "";
  document.getElementById("email_error").innerText = "";
  document.getElementById("phone_error").innerText = "";
  document.getElementById("add_name").style.borderColor = "";
  document.getElementById("add_email").style.borderColor = "";
  document.getElementById("add_phone").style.borderColor = "";
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
    await removeContactFromAllTasks(id);
    renderContacts();
    closeOverlayEditContact();
    closeOverlayContactInfoAfterDelete();
  } catch (error) {
    console.error("Error by delete the contact:", error);
  }
}

async function removeContactFromAllTasks(contactId) {
  try {
    const response = await fetch(BASE_URL + "tasks.json");
    const tasks = await response.json();
    for (const taskId in tasks) {
      const task = tasks[taskId];
      if (task.assigned && task.assigned[contactId]) {
        await fetch(`${BASE_URL}/tasks/${taskId}/assigned/${contactId}.json`, {
          method: "DELETE",
        });
      }
    }
  } catch (error) {
    console.error("Error removing contact from tasks:", error);
  }
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

function getInitials(name) {
  let words = name.split(" ");
  let initialsArray = words.map(function (word) {
    let firstLetter = word.charAt(0).toUpperCase();
    return firstLetter;
  });
  let initials = initialsArray.join("");
  return initials;
}
