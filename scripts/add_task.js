BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
selectedButton = "";
let subtasksList = {};
arrayOfContacts = [];
selectedContacts = [];
let assignedContacts = [];
let selectetCategory = "";
let categoryFirstOpen = true;
let contactFirstOpen = true;
requiredTitle = false;
requiredDate = false;
requiredCategory = false;

function render() {
  renderContacts("contacts");
}

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

function pushContactsToSelectField() {
  let contactlist = document.getElementById("contact-list");
  contactlist.innerHTML = "";
  for (let i = 0; i < arrayOfContacts.length; i++) {
    const currentContact = arrayOfContacts[i];
    renderContactTemplate(contactlist, currentContact, i);
  }
}

function renderContactTemplate(contactlist, currentContact, i) {
  contactlist.innerHTML += /*html*/ `
            <div onclick="addContact(${i})" id="contact${i}" class="contactlist">
                <div class="flex_gap_16">
                    <div class="contact-img-cyrcle" style="background-color: ${currentContact.color}">${returnFirstLetter(currentContact.name)}</div>
                    ${currentContact.name}
                </div>
                <div id="contact-checkbox${i}">
                    <img src="assets/icons/addTask/box.svg" alt="">
                </div>
            </div>
        `;
}

function searchContacts() {
  let search = document.getElementById("contact-input").value.toLowerCase(); // Kleinbuchstaben für Vergleich
  let contactlist = document.getElementById("contact-list");
  contactlist.innerHTML = "";
  let current = arrayOfContacts.map((contact, index) => ({ ...contact, index })).filter((contact) => contact.name.toLowerCase().startsWith(search));
  for (let i = 0; i < current.length; i++) {
    let index = current[i].index;
    let currentContact = arrayOfContacts[index];
    renderContactTemplate(contactlist, currentContact, index);
  }
}

function openContactList() {
  let contactList = document.getElementById("contact-list");
  let inputBorder = document.getElementById("contact-input-border");
  let inputField = document.getElementById("contact-input-field");
  if (contactList.classList.contains("visible")) return closeContactList();
  document.getElementById("assigned").classList.add("display_none");
  inputBorder.classList.add("subtask-inputfield-focus");
  inputField.innerHTML = /*html*/ `
    <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa.svg" alt="">
  `;
  contactList.classList.remove("display_none");
  if (contactFirstOpen) {
    void contactList.offsetWidth;
    contactFirstOpen = false;
  }
  showContactList(contactList);
}

function showContactList(contactList) {
  setTimeout(() => {
    contactList.classList.add("visible");
    document.addEventListener("click", handleContactOutsideClick);
  }, 10);
}

function handleContactOutsideClick(event) {
  let contactList = document.getElementById("contact-list");
  let contactWrapper = document.getElementById("contact-wrapper");
  if (!contactWrapper.contains(event.target)) {
    closeContactList();
    document.removeEventListener("click", handleContactOutsideClick);
  }
}

function closeContactList() {
  let contactList = document.getElementById("contact-list");
  let inputBorder = document.getElementById("contact-input-border");
  let inputField = document.getElementById("contact-input-field");
  inputBorder.classList.remove("subtask-inputfield-focus");
  inputField.innerHTML = /*html*/ `
    <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa (1).svg" alt="">
  `;
  contactList.classList.remove("visible");
  setTimeout(() => {
    contactList.classList.add("display_none");
    document.getElementById("contact-input").value = "";
    document.getElementById("assigned").classList.remove("display_none");
  }, 125);
  document.removeEventListener("click", handleContactOutsideClick);
}

function addContact(x) {
  if (selectedContacts.includes(x)) {
    removeContact(x);
  } else {
    setContact(x);
  }
  renderSelectetContacts();
}

function setContact(x) {
  let addContact = document.getElementById("contact" + x);
  addContact.classList.remove("contactlist");
  addContact.classList.add("contactlist-clicket");
  let box = document.getElementById("contact-checkbox" + x);
  box.innerHTML = /*html*/ `
        <img src="assets/icons/addTask/checkbox.svg" alt="">
    `;
  selectedContacts.push(x);
}

function returnFirstLetter(name) {
  let words = name.split(" ");
  let initialsArray = words.map(function (word) {
    let firstLetter = word.charAt(0).toUpperCase();
    return firstLetter;
  });
  let initials = initialsArray.join("");
  return initials;
}

function removeContact(x) {
  let addContact = document.getElementById("contact" + x);
  addContact.classList.add("contactlist");
  addContact.classList.remove("contactlist-clicket");
  let box = document.getElementById("contact-checkbox" + x);
  box.innerHTML = /*html*/ `
        <img src="assets/icons/addTask/box.svg" alt="">
    `;
  const index = selectedContacts.indexOf(x);
  selectedContacts.splice(index, 1);
}

function renderSelectetContacts() {
  let wrapper = document.getElementById("assigned");
  wrapper.innerHTML = "";
  for (let i = 0; i < selectedContacts.length; i++) {
    const index = selectedContacts[i];
    wrapper.innerHTML += /*html*/ `
            <div class="contact-img-cyrcle" style="background-color: ${arrayOfContacts[index].color}">${returnFirstLetter(arrayOfContacts[index].name)}</div>
        `;
  }
}

function setPrio(x) {
  resetPrioButton();
  let button = document.getElementById(x);
  selectedButton = x;
  button.classList.add("backgroundcolor" + x);
  button.classList.remove("urgentbutton");
  document.getElementById("icon" + x).innerHTML = /*html*/ `
        <img src="assets/icons/addTask/icon_clicket_${x}.svg" alt="">
    `;
}

function resetPrioButton() {
  if ((selectedButton == "") == false) {
    let button = document.getElementById(selectedButton);
    button.classList.remove("backgroundcolor" + selectedButton);
    button.classList.add("urgentbutton");
    document.getElementById("icon" + selectedButton).innerHTML = /*html*/ `
        <img src="assets/icons/addTask/icon_${selectedButton}.svg" alt="">
    `;
  }
}

function openCatecoryList() {
  let categoryList = document.getElementById("catecory-list");
  let inputBorder = document.getElementById("catecory-input-border");
  let inputField = document.getElementById("catecory-input-field");
  if (categoryList.classList.contains("visible")) return closeCatecoryList();
  inputBorder.classList.add("subtask-inputfield-focus");
  inputField.innerHTML = /*html*/ `<img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa.svg" alt="">`;
  categoryList.classList.remove("display_none");
  if (categoryFirstOpen) {
    void categoryList.offsetWidth;
    categoryFirstOpen = false;
  }
  showCategoryList(categoryList);
}

function showCategoryList(categoryList) {
  setTimeout(() => {
    categoryList.classList.add("visible");
    document.addEventListener("click", handleOutsideClick);
  }, 10);
}

function handleOutsideClick(event) {
  let categoryList = document.getElementById("catecory-list");
  let inputBorder = document.getElementById("catecory-input-border");
  if (!categoryList.contains(event.target) && !inputBorder.contains(event.target)) {
    closeCatecoryList();
    document.removeEventListener("click", handleOutsideClick);
  }
}

function closeCatecoryList() {
  let categoryList = document.getElementById("catecory-list");
  let inputBorder = document.getElementById("catecory-input-border");
  let inputField = document.getElementById("catecory-input-field");
  inputBorder.classList.remove("subtask-inputfield-focus");
  inputField.innerHTML = /*html*/ `
    <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa (1).svg" alt="">
  `;
  categoryList.classList.remove("visible");
  setTimeout(() => {
    categoryList.classList.add("display_none");
  }, 225);
  document.removeEventListener("click", handleOutsideClick);
}

function addCatecory(categoryNum) {
  let categoryInput = document.getElementById("catecory-input");
  if (categoryNum === 1) {
    categoryInput.value = "Technical Task";
  } else if (categoryNum === 2) {
    categoryInput.value = "User Story";
  }
  closeCatecoryList();
  document.getElementById("required-category").classList.add("display_none");
}

function invisibleCategoryPlaceholder() {
  document.getElementById("category-placeholder").classList.add("display_none");
}

function checkRequiredField() {
  checkRequiredTitle();
  checkRequiredDate();
  checkRequiredcategory();
  if (requiredTitle && requiredDate && requiredCategory === true) {
    creatTask();
  }
}

function checkRequiredTitle() {
  let title = document.getElementById("title");
  if (title.value === "") {
    document.getElementById("required-title").classList.remove("display_none");
    title.classList.add("inputfield-required");
  } else {
    requiredTitle = true;
    document.getElementById("required-title").classList.add("display_none");
    title.classList.remove("inputfield-required");
  }
}

function checkRequiredDate() {
  let date = document.getElementById("date");
  if (date.value === "") {
    document.getElementById("required-date").classList.remove("display_none");
    date.classList.add("inputfield-required");
  } else {
    requiredDate = true;
    document.getElementById("required-date").classList.add("display_none");
    date.classList.remove("inputfield-required");
  }
}

function checkRequiredcategory() {
  let category = document.getElementById("catecory-input");
  if (category.value === "") {
    document.getElementById("required-category").classList.remove("display_none");
    document.getElementById("catecory-input-border").classList.add("inputfield-required");
  } else {
    requiredCategory = true;
    document.getElementById("required-category").classList.add("display_none");
    document.getElementById("catecory-input-border").classList.remove("inputfield-required");
  }
}

function creatTask() {
  let data = returnAllData();
  postAllData("tasks", data);
  clearAllTasks();
  finishTaskNotification();
  setTimeout(() => {
    window.location.href = "http://127.0.0.1:5501/board.html";
  }, 3000);
}

function returnAllData() {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("date").value;
  let category = document.getElementById("catecory-input").value;
  renderContactsToNewTask();
  let id = `task_${Date.now()}`;
  let status = "toDo";
  return tamplate(id, title, description, assignedContacts, date, selectedButton, category, subtasksList, status, localStorage.userId);
}

function renderContactsToNewTask() {
  assignedContacts = [];
  for (let index = 0; index < selectedContacts.length; index++) {
    const contactNumber = selectedContacts[index];
    const contact = arrayOfContacts[contactNumber];
    assignedContacts.push({
      id: contact.id,
      color: contact.color,
      name: contact.name,
    });
  }
}

function tamplate(id, title, description, assignedContacts, date, selectedButton, category, subtasks, status, user) {
  return {
    [id]: {
      id: id,
      title: title,
      description: description || " ",
      assigned: assignedContacts,
      date: date,
      prio: selectedButton || " ",
      category: category,
      subtask: subtasks || [],
      status: status,
      user: user,
    },
  };
}

async function postAllData(path = "", data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJSON = response.json();
  return responseToJSON;
}

function finishTaskNotification() {
  document.getElementById("finish-box").classList.add("finish-container-activ");
  setTimeout(() => {
    document.getElementById("finish-box").classList.remove("finish-container-activ");
  }, 2000);
}

function clearAllTasks() {
  pushContactsToSelectField();
  resetPrioButton();
  subtasksList = {};
  renderSubtasks();
  selectedContacts = [];
  renderSelectetContacts();
  clearValueOfInputFields();
}

function clearValueOfInputFields() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("assigned").value = "";
  document.getElementById("date").value = "";
  document.getElementById("catecory-input").value = "";
  document.getElementById("subtask").value = "";
}

function borderFocus() {
  let border = document.getElementById("subtusk-input-border");
  border.classList.add("subtask-inputfield-focus");
  document.addEventListener("click", function outsideClick(event) {
    if (!border.contains(event.target)) {
      border.classList.remove("subtask-inputfield-focus");
      document.removeEventListener("click", outsideClick);
    }
  });
}
