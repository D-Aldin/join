BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

selectedButton = "";

let subtasks = {};

arrayOfContacts = [];

selectedContacts = [];

let assignedContacts = [];

let selectetCategory = "";

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
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
  pushContactsToSelectField();
}

function pushContactsToSelectField() {
  let contactlist = document.getElementById("contact-list");
  for (let i = 0; i < arrayOfContacts.length; i++) {
    const currentContact = arrayOfContacts[i];
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
}

function openContactList() {
  let contactlist = document.getElementById("contact-list");
  let contactWrapper = document.getElementById("contact-wrapper");
  document.getElementById("assigned").classList.add("display_none");
  document.getElementById("contact-input-border").classList.add("subtask-inputfield-focus");
  document.getElementById("contact-input-field").innerHTML = /*html*/ `
        <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa.svg" alt="">
    `;
  contactlist.classList.remove("display_none");
  document.addEventListener("click", function outsideClick(event) {
    if (!contactWrapper.contains(event.target)) {
      closeContactList(contactlist);
      document.removeEventListener("click", outsideClick);
    }
  });
}

function closeContactList(contactlist) {
  contactlist.classList.add("display_none");
  document.getElementById("contact-input-border").classList.remove("subtask-inputfield-focus");
  document.getElementById("contact-input-field").innerHTML = /*html*/ `
        <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa (1).svg" alt="">
    `;
  document.getElementById("assigned").classList.remove("display_none");
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
            <div class="contact-img-cyrcle" style="background-color: ${arrayOfContacts[index].color}">${arrayOfContacts[index].name.charAt(0)}</div>
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
  let categorytlist = document.getElementById("catecory-list");
  let categoryWrapper = document.getElementById("catecory-wrapper");
  inputfield = document.getElementById("catecory-input-field");
  inputfield.readonly = true;
  document.getElementById("catecory-input-border").classList.add("subtask-inputfield-focus");
  document.getElementById("catecory-input-field").innerHTML = /*html*/ `
        <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa.svg" alt="">
    `;
  categorytlist.classList.remove("display_none");
  document.addEventListener("click", function outsideClick(event) {
    if (!categoryWrapper.contains(event.target)) {
      closeCatecoryList(categorytlist);
      document.removeEventListener("click", outsideClick);
    }
  });
}

function closeCatecoryList(categorytlist) {
  categorytlist.classList.add("display_none");
  document.getElementById("catecory-input-border").classList.remove("subtask-inputfield-focus");
  document.getElementById("catecory-input-field").innerHTML = /*html*/ `
        <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa (1).svg" alt="">
    `;
}

function addCatecory(x) {
  let input = document.getElementById("catecory-input");
  let category = document.getElementById("catecory" + x).innerHTML;
  let categorytlist = document.getElementById("catecory-list");
  input.value = category;
  selectetCategory = input.value;
  closeCatecoryList(categorytlist);
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
  /*window.location.href = "http://127.0.0.1:5501/board.html";*/
}

function returnAllData() {
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let date = document.getElementById("date").value;
  let category = document.getElementById("catecory-input").value;
  renderContactsToNewTask();
  let id = `task_${Date.now()}`;
  let status = "ToDo";
  console.log(id, title, description, assignedContacts, date, selectedButton, category, subtasks, status, localStorage.userId);
  return tamplate(id, title, description, assignedContacts, date, selectedButton, category, subtasks, status, localStorage.userId);
}

function renderContactsToNewTask() {
  assignedContacts = [];
  for (let index = 0; index < selectedContacts.length; index++) {
    const contactNumber = selectedContacts[index];
    const contact = arrayOfContacts[contactNumber];
    let assignedContact = {
      [contact.id]: {
        color: contact.color,
        name: contact.name,
      },
    };
    assignedContacts.push(assignedContact);
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
    method: "PUT",
    body: JSON.stringify(data),
  });
  return await response.json();
}

function finishTaskNotification() {
  document.getElementById("finish-box").classList.add("finish-container-activ");
  setTimeout(() => {
    document.getElementById("finish-box").classList.remove("finish-container-activ");
  }, 3000);
}

function clearAllTasks() {
  resetPrioButton();
  subtasks = [];
  renderSubtasks();
  selectedContacts = [];
  renderSelectetContacts();
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

function writeSubtask() {
  let subtask = document.getElementById("subtask").value;
  document.getElementById("subtusk-input-border").classList.add("subtask-inputfield-focus");
  if (subtask.length < 1) {
    setStandardButton();
  }
  if (subtask.length >= 1) {
    setdubbleButton();
  }
}

function setStandardButton() {
  document.getElementById("subtaskbuttons").innerHTML = /*html*/ `
            <button type="button" class="subtask-inputfield-button">
                <img src="assets/icons/addTask/subtasks_icons.svg" alt="">
            </button>
        `;
}

function setdubbleButton() {
  document.getElementById("subtaskbuttons").innerHTML = /*html*/ `
            <button type="button" class="subtask-inputfield-button">
                <img onclick="clearsubtask()" src="assets/icons/addTask/cross.svg" alt="">
            </button>
            <div class="pixelbar-mini"></div>
            <button type="button" class="subtask-inputfield-button">    
                <img onclick="setSubtask()" src="assets/icons/addTask/done.svg" alt="">
            </button>`;
}

function clearsubtask() {
  document.getElementById("subtask").value = "";
  setStandardButton();
}

function setSubtask() {
  let subtask = document.getElementById("subtask").value;
  let newSubtask = {
    state: false,
    task: subtask,
  };
  subtasks.push(newSubtask);
  renderSubtasks();
  clearsubtask();
}

function renderSubtasks() {
  let tasks = document.getElementById("tasks-wrapper");
  tasks.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const element = subtasks[i].task;
    subtasksTemplate(tasks, i, element);
  }
}

function subtasksTemplate(tasks, i, element) {
  tasks.innerHTML += /*html*/ `
        <div id="${i}" class="subtask-list" >
            <ul class="full_with" ondblclick="editSubtask(${i})">
                <li>${element}</li>   
            </ul>
            <div class="subtask-list-button-container">
                <button type="button" onclick="editSubtask(${i})" class="subtask-list-button"><img src="assets/icons/addTask/pen.svg" alt=""></button>
                <div class="pixelbar-subtask"></div>
                <button type="button" onclick="deleteSubtask(${i})" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
            </div>
        </div>`;
}

function deleteSubtask(x) {
  subtasks.splice(x, 1);
  renderSubtasks();
}

function editSubtask(x) {
  currentcontainer = document.getElementById(x);
  currentcontainer.classList.remove("subtask-list");
  currentcontainer.classList.add("subtask-list-by-edit");

  document.getElementById(x).innerHTML = /*html*/ `
        <input class="subtask-edit-inputfield" id="current-subtask${x}" type="text">
        <div class="subtask-list-button-container-by-edit">
                <button type="button" onclick="setEditSubtask(${x})" class="subtask-list-button"><img src="assets/icons/addTask/done.svg" alt=""></button>
                <div class="pixelbar-subtask"></div>
                <button type="button" onclick="deleteSubtask(${x})" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
        </div>`;
  currentsubtask = document.getElementById("current-subtask" + x);
  currentsubtask.value = subtasks[x].task;
  /*
    document.addEventListener("click", function outsideClick(event) {
        if (!currentcontainer.contains(event.target)) {
            setEditSubtask(x);
            document.removeEventListener("click", outsideClick);
        }
    });*/
}

function setEditSubtask(x) {
  let subtaskText = document.getElementById("current-subtask" + x).value;
  subtasks[x].task = subtaskText;
  renderSubtasks();
}
