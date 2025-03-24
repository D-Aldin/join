/**
 * Global variables for task management.
 */
let contactList = [],
  storeThePrioValue = " ",
  subtaskObject = {},
  statusOfRequired = false,
  taskStatus = "toDo",
  selectedContactIds = [];

/**
 * Displays the task overlay with an animation.
 * @param {Event} event - The event triggering the overlay display.
 */
function showOverlay(event) {
  const overlay = document.querySelector("#overlayForAddTask");
  const taskBox = document.querySelector("#add_task_box");
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
  overlay.style.display = "block";
  document.querySelector("header").style.zIndex = "0";
  document.querySelector("aside").style.zIndex = "0";
  void overlay.offsetWidth;
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  taskBox.style.animation = "slideInFromRight 125ms ease forwards";
}

/**
 * Hides the task overlay with an animation.
 */
function hideOverlay() {
  const overlay = document.querySelector("#overlayForAddTask");
  const taskBox = document.querySelector("#add_task_box");
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
  taskBox.style.animation = "slideOutToRight 125ms ease forwards";
  selectedContactIds = [];
  setTimeout(() => {
    overlay.style.display = "none";
  }, 125);
}

/**
 * Renders the add task menu, redirecting to a new page if the screen is too small.
 */
function renderAddTaskMenu() {
  let addTaskButton = document.querySelector("#add_task_box");
  if (window.innerWidth > 1200) {
    addTaskButton.innerHTML = HTMLTamplateForAddTaskInBorad();
  } else {
    window.location = "add_task.html";
  }
  buttonMedium(event);
  disablePastDates("dateBoard");
}

/**
 * Fetches contacts and displays them in the dropdown menu.
 */
async function displayDropDownMenuSectionAddTask() {
  document.querySelector(".contentSectionAddTask").innerHTML = "";
  let contactsData = await fetchTasks("contacts");
  for (const key in contactsData) {
    if (Object.prototype.hasOwnProperty.call(contactsData, key)) {
      renderContactItem(key, contactsData[key]);
    }
  }
}

/**
 * Renders a contact item in the dropdown menu.
 * @param {string} key - The contact's unique identifier.
 * @param {Object} profile - The contact's profile data.
 */
function renderContactItem(key, profile) {
  const profileInitials = initials(profile.name);
  const isSelected = selectedContactIds.includes(key);
  const checkboxImage = isSelected ? "./assets/icons/checkbox/check_white.svg" : "./assets/icons/checkbox/openCardRectangle.svg";
  const contactHTML = HTMLTamplateForDropdownProfilesSectionAddTask(key, profile.color, profileInitials, profile.name);
  document.querySelector(".contentSectionAddTask").innerHTML += contactHTML;
  if (isSelected) {
    setTimeout(() => {
      const contactElement = document.querySelector(`.contentSectionAddTask [id_value="${key}"]`);
      contactElement.classList.add("selected_contact");
      contactElement.querySelector("img").src = checkboxImage;
    }, 0);
  }
}

/**
 * Toggles the selection state of a contact.
 * @param {Event} event - The event triggering the contact selection.
 */
function chooseContact(event) {
  event.stopPropagation();
  const profile = event.currentTarget,
    contactID = profile.getAttributeNode("id_value").value,
    checkbox = profile.lastElementChild.lastElementChild,
    index = selectedContactIds.indexOf(contactID);
  const isAlreadySelected = index !== -1;
  if (isAlreadySelected) {
    selectedContactIds.splice(index, 1);
    profile.classList.remove("selected_contact");
    checkbox.src = "./assets/icons/checkbox/openCardRectangle.svg";
    unselect(contactID);
  } else {
    selectedContactIds.push(contactID);
    profile.classList.add("selected_contact");
    checkbox.src = "./assets/icons/checkbox/check_white.svg";
    displayChossenContact(contactID);
  }
}

/**
 * Displays a selected contact in the chosen contacts section.
 * @param {string} id - The contact's ID.
 */
async function displayChossenContact(id) {
  let profileContainer = document.querySelector(".chosen_contacts");
  let dataFromFireBase = await fetchTasks(`contacts/${id}`);
  let name = initials(dataFromFireBase.name);
  let color = dataFromFireBase.color;
  profileContainer.innerHTML += contactTamplateForAddTaskSectionInBoard(name, color, id);
  handlesToManyContacts(profileContainer.children);
}

/**
 * Removes a selected contact from the chosen contacts section.
 * @param {string} id - The contact's ID.
 */
function unselect(id) {
  let refElement = document.querySelector(`[profile_id=${id}]`);
  refElement.remove();
}

/**
 * Focuses the subtask input field and displays its buttons.
 */
function focusTheField() {
  const inputSubtask = document.querySelector("#subtask");
  inputSubtask.focus();
  document.querySelector(".subtask-inputfield-button").classList.toggle("hide_element");
  document.querySelector(".inputFiledSubtask").classList.toggle("hide_element");
  inputSubtask.value = "";
  setEventListenerForSubtask();
}

/**
 * Closes the subtask input field and resets its value.
 */
function closeInputField() {
  const inputSubtask = document.querySelector("#subtask");
  document.querySelector(".subtask-inputfield-button").classList.toggle("hide_element");
  document.querySelector(".inputFiledSubtask").classList.toggle("hide_element");
  inputSubtask.value = "";
}

/**
 * Adds a new subtask to the task wrapper.
 */
function newSubtask() {
  const inputSubtask = document.querySelector("#subtask");
  document.querySelector("#tasks-wrapper").innerHTML += HTMLTamplateForSubtasksInAddTaskBoard(inputSubtask.value);
  inputSubtask.value = "";
  closeInputField();
}

/**
 * Deletes a subtask from the board section.
 * @param {Event} event - The event triggering the deletion.
 */
function deleteSubtaskBoardSection(event) {
  let task = event.currentTarget.parentElement.parentElement;
  task.remove();
}

/**
 * Edits a subtask by transforming it into an input field.
 * @param {Event} event - The event triggering the edit.
 */
function editSubtaskInAddTaskAreaBoard(event) {
  let task = event.currentTarget.parentElement.parentElement;
  let id = task.id;
  document.getElementById(task.id).style.backgroundColor = "white";
  task.innerHTML = HTMLTamplateForEditSubtaskAreaAddTask(id);
  let inputField = document.querySelector(".edit_subtask_input_field input");
  document.querySelector(".edit_subtask_input_field ").style = "border-bottom: 1px solid rgba(133, 192, 217)";
  inputField.value = task.id;
}

/**
 * Deletes an editing subtask.
 * @param {Event} event - The event triggering the deletion.
 */
function deleteEditingSubtask(event) {
  let taskID = event.currentTarget.getAttribute("id_trash");
  let refTask = document.querySelector(`#${taskID}`);
  refTask.remove();
}

/**
 * Confirms an edited subtask and updates it in the list.
 * @param {Event} event - The event triggering the confirmation.
 */
function confirmEditing(event) {
  let task = event.currentTarget.parentElement.parentElement.parentElement;
  let inputField = document.querySelector(".edit_subtask_input_field input");
  task.remove();
  document.querySelector("#tasks-wrapper").innerHTML += HTMLTamplateForSubtasksInAddTaskBoard(inputField.value);
}

/**
 * Collects all input data for a new task.
 * @returns {Promise<Object>} The structured task data object.
 */
async function collectDataForNewTask() {
  const inputTitle = document.querySelector("#title");
  const inputDescription = document.querySelector("#description");
  let inputDate = document.querySelector("#dateBoard");
  const inputCategory = document.querySelector("#category");
  let id = `task_${Date.now()}`;
  collectTheContacts();
  collectTheSubtasks();
  let contacts = await getContactsFromFireBase(contactList);
  if (storeThePrioValue === " ") {
    storeThePrioValue = "low";
  }
  return tamplate(id, inputTitle.value, inputDescription.value, contacts, inputDate.value, storeThePrioValue, inputCategory.value, subtaskObject, taskStatus, localStorage.userId);
}

/**
 * Creates a task template object.
 * @param {string} id - Task ID.
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {Array} contact - Assigned contacts.
 * @param {string} date - Due date.
 * @param {string} prio - Priority level.
 * @param {string} category - Task category.
 * @param {Object} subtask - Subtasks.
 * @param {string} status - Task status.
 * @param {string} user - User ID.
 * @returns {Object} The task template object.
 */
function tamplate(id, title, description, contact, date, prio, category, subtask, status, user) {
  return {
    [id]: {
      id: id,
      title: title,
      description: description || " ",
      assigned: contact,
      date: date || document.querySelector("#dateBoard").value,
      prio: prio || "low",
      category: category,
      subtask: subtask || [],
      status: status,
      user: user,
    },
  };
}

/**
 * Collects selected contacts and updates the contact list.
 */
function collectTheContacts() {
  let refAllChosenContacts = document.querySelectorAll("#profile");
  refAllChosenContacts.forEach((element) => {
    let contact = element.getAttribute("profile_id");
    if (!contactList.includes(contact)) {
      contactList.push(contact);
    }
  });
  contactList = [...selectedContactIds];
}

/**
 * Collects subtasks and stores them in an object.
 */
function collectTheSubtasks() {
  let refAllChosenSubtasks = document.querySelectorAll(".subtask_paragraf");
  for (let index = 0; index < refAllChosenSubtasks.length; index++) {
    const task = refAllChosenSubtasks[index].innerHTML.substring(1);
    subtaskObject[`subtask_${crypto.randomUUID()}`] = { task: task, state: false };
  }
}

/**
 * Validates if the title field is filled.
 */
function requiredFieldTitle() {
  const inputFiledTitle = document.querySelector("#title");
  if (inputFiledTitle.value.length === 0) {
    inputFiledTitle.classList.add("required_color");
    document.querySelector("#titleRequired").classList.remove("hide_element");
  }
  inputFiledTitle.addEventListener("input", function () {
    this.classList.remove("required_color");
    document.querySelector("#titleRequired").classList.add("hide_element");
  });
}

/**
 * Validates if the date field is filled.
 */
function requiredFieldDate() {
  let inputFiledDate = document.getElementById("dateBoard");
  let dateValue = inputFiledDate.value;
  if (!dateValue || isNaN(new Date(dateValue).getTime())) {
    inputFiledDate.classList.add("required_color");
    document.querySelector("#dateRequired").classList.remove("hide_element");
  }
  inputFiledDate.addEventListener("change", function () {
    this.classList.remove("required_color");
    document.querySelector("#dateRequired").classList.add("hide_element");
  });
  inputFiledDate.addEventListener("input", function () {
    this.classList.remove("required_color");
    document.querySelector("#dateRequired").classList.add("hide_element");
  });
}

/**
 * Validates if the category field is selected.
 */
function requiredFieldCategory() {
  const inputFiledCategory = document.querySelector("#category");
  if (inputFiledCategory.value === "placeholder") {
    inputFiledCategory.classList.add("required_color");
    document.querySelector("#categoryRequired").classList.remove("hide_element");
  }
  inputFiledCategory.addEventListener("input", function () {
    this.classList.remove("required_color");
    document.querySelector("#categoryRequired").classList.add("hide_element");
  });
}

/**
 * Removes the placeholder option from the category dropdown.
 */
function mimicPlaceHolder() {
  let placeholder = document.querySelector('option[value="placeholder"]');
  if (!placeholder) {
    return;
  }
  placeholder.remove();
}

/**
 * Creates a task, validates inputs, and saves it to Firebase.
 */
async function createTask() {
  let card = await collectDataForNewTask();
  if (!validateInputs()) return;
  showTaskAddedAnimation();
  addDataToFireBase("tasks", card);
  hideTaskAddedAnimation();
}

/**
 * Validates required input fields before creating a task.
 * @returns {boolean} Whether the input fields are valid.
 */
function validateInputs() {
  requiredFieldTitle();
  requiredFieldDate();
  requiredFieldCategory();
  const title = document.querySelector("#title").value;
  const date = document.getElementById("dateBoard").value;
  const category = document.querySelector("#category").value;
  return title.length && date && date !== 0 && category !== "placeholder";
}

/**
 * Displays the task added animation.
 */
function showTaskAddedAnimation() {
  const taskAdded = document.querySelector(".task_added");
  taskAdded.classList.remove("msg_d_none");
  taskAdded.style.animation = "slideInFromRight 125ms ease forwards";
}

/**
 * Hides the task added animation and redirects to the board.
 */
function hideTaskAddedAnimation() {
  setTimeout(() => {
    document.querySelector(".task_added").style.animation = "slideOutToRight 125ms ease forwards";
    setTimeout(() => {
      hideOverlay();
      window.location = "board.html";
    }, 125);
  }, 1000);
}

function disablePastDates(element) {
  const today = new Date().toISOString().split("T")[0];
  document.querySelector(`#${element}`).setAttribute("min", today);
}
