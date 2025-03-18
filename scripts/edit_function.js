const refUrgentBtn = document.getElementById("urgent");
const refMediumBtn = document.getElementById("medium");
const refLowBtn = document.getElementById("low");
const title = document.querySelector(".open_card_title");

/**
 *
 * Renders the edit menu, displaying the task's title, description, date, and subtasks.
 */
function renderEditMenu() {
  refCardBox.innerHTML = "";
  refCardBox.innerHTML += HTMLTamplateForTheEditFunk();
  displaySubtasksInTheEditMenu();
  changeTitleAndDescription();
  changeDate();
  displayValuesInTheInputFields();
}

/**
 * Populates the input fields with the task's title, description, and date.
 */
function displayValuesInTheInputFields() {
  document.querySelector("#editTitle").value = titleValue;
  document.querySelector("#editDescription").value = descriptionValue;
  document.querySelector("#editDate").value = dateValue;
}

/**
 * Saves the edited data to Firebase under a specific section.
 * @param {string} section - The section to update (e.g., "title", "description").
 * @param {string} newValue - The new value to save.
 */
async function saveDataToFire(section, newValue) {
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}.json`, {
    method: "PATCH",
    body: JSON.stringify({ [section]: newValue }),
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Initiates the task edit process, fetching data from Firebase and rendering the necessary UI elements.
 */
async function editFunction() {
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  displayContactsInDropdownMenu();
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  for (const key in dataFromFireBase[idOfcurrentElement].assigned) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase[idOfcurrentElement].assigned, key)) {
      const profile = initials(dataFromFireBase[idOfcurrentElement].assigned[key].name);
      const color = dataFromFireBase[idOfcurrentElement].assigned[key].color;
      document.querySelector(".assigned_to").innerHTML += `<div class="circle circle_profile_names spacing" style="background-color: ${color}">${profile}</div>`;
    }
  }
  handlesToManyContacts();
}

/**
 * Sets up event listeners to change the task's title and description in Firebase when edited.
 */
async function changeTitleAndDescription() {
  let refTitle = document.querySelector("#editTitle");
  let refDescriptionField = document.querySelector("#editDescription");
  refTitle.addEventListener("change", function () {
    saveDataToFire("title", refTitle.value);
  });
  refDescriptionField.addEventListener("change", function () {
    saveDataToFire("description", refDescriptionField.value);
  });
}

/**
 * Sets up an event listener to change the task's due date in Firebase when edited.
 */
async function changeDate() {
  let taskDate = document.querySelector("#editDate");
  taskDate.addEventListener("change", function () {
    saveDataToFire("date", taskDate.value);
  });
}

/**
 * Displays the selected priority for a task.
 * @param {string} data - The priority level (e.g., "urgent", "medium", "low").
 */
function displaySelectedPriority(data) {
  const priorityMap = {
    urgent: { color: "rgb(255, 61, 0)", img: "icon_clicket_urgent.svg" },
    medium: { color: "rgb(255, 168, 0)", img: "icon_clicket_medium.svg" },
    low: { color: "rgb(122, 226, 41)", img: "icon_clicket_low.svg" },
  };

  if (priorityMap[data]) {
    let element = document.getElementById(data);
    element.style.backgroundColor = priorityMap[data].color;
    element.style.color = "white";
    document.getElementById(`${data}ImageEditBtn`).src = `./assets/icons/addTask/${priorityMap[data].img}`;
    element.classList.add("no_hover");
  }
}

/**
 * Handles setting the priority to "urgent" and updates the task.
 *
 */
async function urgent() {
  saveDataToFire("prio", "urgent");
  document.querySelector(".assigned_to").innerHTML = " ";
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  renderEditMenu();
  editFunction();
}

/**
 * Handles setting the priority to "medium" and updates the task.
 *
 */
async function medium() {
  saveDataToFire("prio", "medium");
  document.querySelector(".assigned_to").innerHTML = " ";
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  renderEditMenu();
  editFunction();
}

/**
 * Handles setting the priority to "low" and updates the task.
 *
 */
async function low() {
  saveDataToFire("prio", "low");
  document.querySelector(".assigned_to").innerHTML = " ";
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  renderEditMenu();
  editFunction();
}

/**
 * Displays the contacts in the dropdown menu.
 */
async function displayContactsInDropdownMenu() {
  document.querySelector(".content").innerHTML = "";
  let dataFromFireBase = await fetchCardDetails("contacts", idOfcurrentElement);
  for (const key in dataFromFireBase) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase, key)) {
      const profile = dataFromFireBase[key];
      const profileInitials = initials(profile.name);
      document.querySelector(".content").innerHTML += HTMLTamplateForDropdownProfiles(key, profile.color, profileInitials, profile.name);
    }
  }
  whichContactIsAssigned(idOfcurrentElement);
  assignNewContList = [];
}

/**
 * Marks the contacts that have been assigned to the current task.
 * @param {string} id - The task's ID.
 */
async function whichContactIsAssigned(id) {
  let dataFromFireBase = await fetchCardDetails("tasks", id);
  if (!dataFromFireBase[id].assigned) {
    dataFromFireBase[id].assigned = {};
  }
  const allContactsInDropdownMenu = document.querySelectorAll(".align_items");
  markAssignedContacts(allContactsInDropdownMenu, dataFromFireBase[id].assigned);
}

/**
 * Marks the assigned contacts in the dropdown list and sets up event listeners for removing contacts.
 * @param {NodeList} allContacts - The list of all contact elements.
 * @param {Object} assignedContacts - The list of assigned contacts.
 */
function markAssignedContacts(allContacts, assignedContacts) {
  allContacts.forEach((contactElement) => {
    const contact = contactElement.getAttributeNode("id_value").value;
    if (Object.keys(assignedContacts).includes(contact)) {
      contactElement.classList.add("selected_contact");
      contactElement.lastElementChild.lastElementChild.src = "./assets/icons/checkbox/check_white.svg";
      contactElement.addEventListener("click", (event) => {
        retractContactFromCard(event);
        contactElement.classList.remove("selected_contact");
        contactElement.lastElementChild.lastElementChild.src = "./assets/icons/checkbox/openCardRectangle.svg";
      });
    }
  });
}

/**
 * Assigns a new contact to the current task.
 * @param {Event} event - The event object from the user interaction.
 */
async function assignNewContacts(event) {
  const contact = event.currentTarget.getAttributeNode("id_value").value;
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  if (!dataFromFireBase[idOfcurrentElement].assigned) {
    dataFromFireBase[idOfcurrentElement].assigned = {};
  }
  if (!(contact in dataFromFireBase[idOfcurrentElement].assigned || assignNewContList.includes(contact))) {
    await handleNewContactAssignment(contact, dataFromFireBase);
  }
}

/**
 * Handles the assignment of a new contact to the task and updates Firebase.
 * @param {string} contact - The contact's ID to be assigned.
 */
async function handleNewContactAssignment(contact) {
  assignNewContList.push(contact);
  let newContact = await getContactsFromFireBase(assignNewContList);
  addDataToFireBase(`${taskPath}/${idOfcurrentElement}/assigned`, newContact);
  let clickedElement = document.querySelector(`[id_value="${contact}"]`);
  clickedElement.classList.add("selected_contact");
  clickedElement.lastElementChild.lastElementChild.src = "./assets/icons/checkbox/check_white.svg";
  document.querySelector(".assigned_to").innerHTML = "";
  editFunction();
  addDataToFireBase(`${taskPath}/${idOfcurrentElement}/assigned`, newContact);
}

/**
 * Removes an assigned contact from the task.
 * @param {Event} event - The event object from the user interaction.
 */
async function retractContactFromCard(event) {
  const contact = event.currentTarget.getAttributeNode("id_value").value;
  let response = await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/assigned/${contact}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  document.querySelector(".assigned_to").innerHTML = "";
  editFunction();
}

/**
 * Displays the subtasks in the edit menu.
 */
async function displaySubtasksInTheEditMenu() {
  const dataFromFireBase = await fetchCardDetails(`${taskPath}/${idOfcurrentElement}/subtask`, idOfcurrentElement);
  for (const element in dataFromFireBase) {
    document.querySelector(".subtasks_box").innerHTML += HTMLTamplateForSubtasksInTheEditMenu(element, dataFromFireBase[element].task);
  }
}

/**
 * Edits an existing subtask.
 * @param {Event} event - The event object from the user interaction.
 */
async function editSubtaskFunk(event) {
  const refSubtaskID = event.currentTarget.getAttributeNode("id_subtask").value;
  const refTaskElement = event.currentTarget;
  const dataFromFireBase = await fetchCardDetails(`${taskPath}/${idOfcurrentElement}/subtask/${refSubtaskID}`, idOfcurrentElement);
  refTaskElement.innerHTML = HTMLTamplateForEditSubtask(refSubtaskID);
  setupSubtaskEditing(refSubtaskID, dataFromFireBase);
}

/**
 * Sets up the subtask editing process, allowing the user to modify the subtask.
 * @param {string} refSubtaskID - The subtask's ID.
 * @param {Object} dataFromFireBase - The data fetched from Firebase for the subtask.
 */
function setupSubtaskEditing(refSubtaskID, dataFromFireBase) {
  let inputField = document.getElementById(`${refSubtaskID}`);
  if (!inputField) return;
  inputField.value = dataFromFireBase.task;
  document.querySelector(`div[id_subtask="${refSubtaskID}"]`).classList.add("under_line");
  document.querySelector(`div[id_subtask="${refSubtaskID}"]`).classList.remove("subtask_box_items");
  document.querySelector(`input[id="${refSubtaskID}"]`).addEventListener("change", (event) => {
    saveEditTask(refSubtaskID, event.target.value);
  });
  document.querySelector(".confirm").addEventListener("click", async (event) => {
    await saveEditTask(refSubtaskID, inputField.value);
    document.querySelector(".subtasks_box").innerHTML = " ";
    displaySubtasksInTheEditMenu();
  });
}

/**
 * Saves the new subtask value to Firebase.
 * @param {string} subtaskID - The subtask's ID.
 * @param {string} newValue - The new value of the subtask.
 */
async function saveEditTask(subtaskID, newValue) {
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/subtask/${subtaskID}.json`, {
    method: "PATCH",
    body: JSON.stringify({ task: newValue }),
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Deletes a subtask from Firebase.
 * @param {Event} event - The event object from the user interaction.
 */
async function deleteSubtask(event) {
  const refTrashButton = event.currentTarget.getAttribute("id_trash");
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/subtask/${refTrashButton}.json`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  document.querySelector(".subtasks_box").innerHTML = " ";
  displaySubtasksInTheEditMenu();
}

/**
 * Adds a new subtask to Firebase.
 *
 */
async function addNewSubtask() {
  let theNewTask = document.querySelector("#editSubtask").value;
  let newTaskObj = {
    [`subtask_${Date.now()}`]: { task: theNewTask, state: false },
  };
  await saveNewSubtask(newTaskObj);
  document.querySelector("#editSubtask").value = "";
  setStandardButtonInOpenCard();
  document.querySelector(".subtasks_box").innerHTML = " ";
  displaySubtasksInTheEditMenu();
}

/**
 * Fetches all subtasks for the current task.
 * @returns {Array} - A list of subtasks.
 */
async function fetchSubtasks() {
  let response = await fetch(`${BASE_URL}/tasks/${idOfcurrentElement}/subtask.json`, {
    method: "GET",
  });
  return (await response.json()) || [];
}

/**
 * Saves a new subtask to Firebase.
 * @param {Object} newTaskObj - The new task object to save.
 */
async function saveNewSubtask(newTaskObj) {
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/subtask.json`, {
    method: "PATCH",
    body: JSON.stringify(newTaskObj),
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Focuses on the input field for adding a new subtask.
 * @param {Event} event - The event object from the user interaction.
 */
function focusOnInputField(event) {
  const newTaskInputField = document.querySelector("#editSubtask").focus();
}

/**
 * Handles the OK button click functionality in the edit menu.
 */
async function okBtnFunk() {
  let id = idOfcurrentElement;
  const fetchDetails = await fetchCardDetails(taskPath, id);
  const refersToCard = fetchDetails[id];
  refCardBox.innerHTML = HTMLForOpenCard(refersToCard.category, refersToCard.title, refersToCard.description, refersToCard.date, refersToCard.prio, id);
  managenProfilesWhenCardOpen(id);
  renderSubtasks(id);
}

/**
 * Handles the change in the subtask input field and updates the button state based on the input's length.
 * If the input field is empty, it sets the button to the standard state.
 * If there is input, it sets the button to the double button state.
 */
function writeEditSubtask() {
  let subtask = document.getElementById("editSubtask").value;
  if (subtask.length < 1) {
    setStandardButtonInOpenCard();
  }
  if (subtask.length >= 1) {
    setdubbleButtonInOpenCard();
  }
}

/**
 * Clears the content of the subtask input field and resets the button to its standard state.
 * Typically called when the user clears the subtask input.
 * @param {Event} event - The event object associated with the action.
 */
function clearEditSubtask(event) {
  document.getElementById("editSubtask").value = "";
  setStandardButtonInOpenCard();
}

function handlesToManyContacts() {
  let xValue = 0;
  let contactContainer = document.querySelector(".assigned_to").children;

  if (contactContainer.length > 10) {
    Array.from(contactContainer).forEach((contact) => {
      contact.style.transform = `translateX(-${xValue}px)`;
      contact.style.width = "2rem";
      contact.style.marginLeft = "-6px";
      xValue += 5;
    });
  }
}
