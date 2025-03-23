BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
selectedButton = "medium";
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

/**
 * Calls functions to render the contacts when the page is initialized.
 * @returns {void}
 */
function render() {
  renderContacts("contacts");
  setPrio("medium");
}

/**
 * Sets the priority for a task.
 * @param {string} x - The ID of the priority button to select.
 * @returns {void}
 */
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

/**
 * Resets the previously selected priority button to its default state.
 * @returns {void}
 */
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

/**
 * Opens the category list dropdown for task selection.
 * @returns {void}
 */
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

/**
 * Shows the category list dropdown with animation.
 * @param {HTMLElement} categoryList - The category list dropdown element.
 * @returns {void}
 */
function showCategoryList(categoryList) {
  setTimeout(() => {
    categoryList.classList.add("visible");
    document.addEventListener("click", handleOutsideClick);
  }, 10);
}

/**
 * Handles closing the category list dropdown if the click is outside the dropdown.
 * @param {Event} event - The event triggered by a click.
 * @returns {void}
 */
function handleOutsideClick(event) {
  let categoryList = document.getElementById("catecory-list");
  let inputBorder = document.getElementById("catecory-input-border");
  if (!categoryList.contains(event.target) && !inputBorder.contains(event.target)) {
    closeCatecoryList();
    document.removeEventListener("click", handleOutsideClick);
  }
}

/**
 * Closes the category list dropdown.
 * @returns {void}
 */
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

/**
 * Adds a category to the input field based on the selected category number.
 * @param {number} categoryNum - The category number (1 for "Technical Task", 2 for "User Story").
 * @returns {void}
 */
function addCatecory(categoryNum) {
  let categoryInput = document.getElementById("catecory-input");
  if (categoryNum === 1) {
    categoryInput.value = "Technical Task";
  } else if (categoryNum === 2) {
    categoryInput.value = "User Story";
  }
  checkRequiredcategory();
  closeCatecoryList();
  document.getElementById("required-category").classList.add("display_none");
}

/**
 * Hides the category placeholder.
 * @returns {void}
 */
function invisibleCategoryPlaceholder() {
  document.getElementById("category-placeholder").classList.add("display_none");
}

/**
 * Validates required fields before creating a task.
 * @returns {void}
 */
function checkRequiredField() {
  checkRequiredTitle();
  checkRequiredDate();
  checkRequiredcategory();
  if (requiredTitle && requiredDate && requiredCategory === true) {
    creatTask();
  }
}

/**
 * Set all Required field invisible.
 */
function setRequiredInvisible() {
  document.getElementById("required-title").classList.add("display_none");
  document.getElementById("title").classList.remove("inputfield-required");
  document.getElementById("required-date").classList.add("display_none");
  document.getElementById("date").classList.remove("inputfield-required");
  document.getElementById("required-category").classList.add("display_none");
  document.getElementById("catecory-input-border").classList.remove("inputfield-required");
}

/**
 * Checks if the title field is filled.
 * @returns {void}
 */
function checkRequiredTitle() {
  let title = document.getElementById("title");
  if (title.value === "") {
    document.getElementById("required-title").classList.remove("display_none");
    title.classList.add("inputfield-required");
    document.getElementById('title-container').classList.add('margin-15px');
    requiredTitle = false;
  } else {
    requiredTitle = true;
    document.getElementById("required-title").classList.add("display_none");
    title.classList.remove("inputfield-required");
  }
}

/**
 * Checks if the date field is filled.
 * @returns {void}
 */
function checkRequiredDate() {
  let date = document.getElementById("date");
  if (date.value === "") {
    document.getElementById("required-date").classList.remove("display_none");
    date.classList.add("inputfield-required");
    document.getElementById('date-container').classList.add('margin-15px');
  } else {
    requiredDate = true;
    document.getElementById("required-date").classList.add("display_none");
    date.classList.remove("inputfield-required");
  }
}

/**
 * Checks if the category field is filled.
 * @returns {void}
 */
function checkRequiredcategory() {
  let category = document.getElementById("catecory-input");
  if (category.value === "") {
    document.getElementById("required-category").classList.remove("display_none");
    document.getElementById("catecory-input-border").classList.add("inputfield-required");
    document.getElementById('category-container').classList.add('margin-15px');
  } else {
    requiredCategory = true;
    document.getElementById("required-category").classList.add("display_none");
    document.getElementById("catecory-input-border").classList.remove("inputfield-required");
  }
}

/**
 * Creates a task by collecting data and posting it to the database.
 * @returns {void}
 */
function creatTask() {
  let data = returnAllData();
  postAllData("tasks", data);
  clearAllTasks();
  finishTaskNotification();
  setTimeout(() => {
    window.location.href = "./board.html";
  }, 1500);
}

/**
 * Collects all task data to send it to the database.
 * @returns {Object} The task data object.
 */
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

/**
 * Renders selected contacts for a new task.
 * @returns {void}
 */
function renderContactsToNewTask() {
  assignedContacts = {};
  for (let index = 0; index < selectedContacts.length; index++) {
    const contactNumber = selectedContacts[index];
    const contact = arrayOfContacts[contactNumber];
    assignedContacts[contact.id] = {
      color: contact.color,
      name: contact.name,
    }
  }
}

/**
 * Creates a template for the task data to be posted.
 * @param {string} id - The task ID.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {Array<Object>} assignedContacts - The assigned contacts for the task.
 * @param {string} date - The due date for the task.
 * @param {string} selectedButton - The selected priority button for the task.
 * @param {string} category - The category of the task.
 * @param {Object} subtasks - The list of subtasks for the task.
 * @param {string} status - The status of the task (e.g., "toDo").
 * @param {string} user - The user ID of the task creator.
 * @returns {Object} The task data object in template format.
 */
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

/**
 * Posts task data to the specified Firebase database path.
 * @param {string} path - The Firebase database path to post the data to.
 * @param {Object} data - The data to post.
 * @returns {Promise<Object>} The response from the database.
 */
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

/**
 * Displays a notification once a task is finished.
 * @returns {void}
 */
function finishTaskNotification() {
  let finishBox = document.getElementById("finish-box");
  finishBox.style.animation = "none";
  finishBox.offsetHeight;
  finishBox.style.animation = "slideInFromRight 125ms forwards";
  finishBox.classList.add("finish-container-activ");
  setTimeout(() => {
    finishBox.style.animation = "slideOutToRight 125ms forwards";
    setTimeout(() => {
      finishBox.classList.remove("finish-container-activ");
    }, 125);
  }, 1000);
}

/**
 * Clears all tasks and resets input fields.
 * @returns {void}
 */
function clearAllTasks() {
  pushContactsToSelectField();
  setPrio("medium");
  subtasksList = {};
  setRequiredItemsFalse();
  renderSubtasks();
  selectedContacts = [];
  renderSelectetContacts();
  clearValueOfInputFields();
  setRequiredInvisible();
  removeClassForRequiredMargin15px();
}

/**
 * set margin back with removing classlist.
 */
function removeClassForRequiredMargin15px() {
  document.getElementById('title-container').classList.remove('margin-15px');
  document.getElementById('date-container').classList.remove('margin-15px');
  document.getElementById('category-container').classList.remove('margin-15px');
}

/**
 * Set all Required Elements false.
 */
function setRequiredItemsFalse() {
  requiredTitle = false;
  requiredDate = false;
  requiredCategory = false;
}

/**
 * Clears the values of all input fields.
 * @returns {void}
 */
function clearValueOfInputFields() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("assigned").value = "";
  document.getElementById("date").value = "";
  document.getElementById("catecory-input").value = "";
  document.getElementById("subtask").value = "";
}

/**
 * Adds focus style to the subtask input field when clicked.
 * @returns {void}
 */
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
