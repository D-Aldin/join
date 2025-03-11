/**
 * Reference to the subtask input field element
 * @type {HTMLElement}
 */
const subtaskInputField = document.querySelector("#subtask");

/**
 * Handles input events for the subtask field
 * Updates the UI buttons based on input content
 */
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

/**
 * Displays the default add button for subtasks
 * Used when the subtask input field is empty
 */
function setStandardButton() {
  document.getElementById("subtaskbuttons").innerHTML = getStandardButton();
}

/**
 * Displays cancel and confirm buttons for subtask creation
 * Used when text is entered in the subtask input field
 */
function setdubbleButton() {
  document.getElementById("subtaskbuttons").innerHTML = getDubbleButton();
}

/**
 * Clears the subtask input field and resets to standard button view
 */
function clearsubtask() {
  document.getElementById("subtask").value = "";
  setStandardButton();
}

/**
 * Creates a new subtask from input field value
 * Generates a unique timestamp-based key and stores the subtask
 */
function setSubtask() {
  let subtask = document.getElementById("subtask").value;
  let newSubtaskKey = `subtask_${Date.now()}`;
  let newSubtask = {
    state: false,
    task: subtask,
  };
  subtasksList[newSubtaskKey] = newSubtask;
  renderSubtasks();
  clearsubtask();
}

/**
 * Renders all subtasks from the subtasksList to the DOM
 * Clears and rebuilds the task wrapper element with current data
 */
function renderSubtasks() {
  let tasks = document.querySelector("#tasks-wrapper");
  tasks.innerHTML = "";
  for (const key in subtasksList) {
    if (Object.prototype.hasOwnProperty.call(subtasksList, key)) {
      const element = subtasksList[key];
      subtasksTemplate(tasks, key, element.task);
    }
  }
}

/**
 * Adds a subtask to the DOM using template
 * @param {HTMLElement} tasks - Container element for subtasks
 * @param {string} i - Unique identifier for the subtask
 * @param {string} element - The subtask text content
 */
function subtasksTemplate(tasks, i, element) {
  tasks.innerHTML += getSubtaskTemplate(i, element);
}

/**
 * Removes a subtask from the collection and updates UI
 * @param {string} x - Unique identifier of subtask to delete
 */
function deleteSubtask(x) {
  delete subtasksList[x];
  renderSubtasks();
}

/**
 * Switches a subtask to edit mode
 * Replaces display with input field containing current text
 * @param {string} x - Unique identifier of subtask to edit
 */
function editSubtask(x) {
  currentcontainer = document.getElementById(x);
  currentcontainer.classList.remove("subtask-list");
  currentcontainer.classList.add("subtask-list-by-edit");
  document.getElementById(x).innerHTML = getEditSubtask(x);
  currentsubtask = document.getElementById("current-subtask" + x);
  currentsubtask.value = subtasksList[x].task;
}

/**
 * Saves changes to an edited subtask
 * Updates the subtask data and refreshes the display
 * @param {Object} x - Element object containing subtask ID
 */
function setEditSubtask(x) {
  let newText = document.querySelector(`#${x.id}`).firstElementChild.value;
  subtasksList[x.id].task = newText;
  renderSubtasks();
}

/**
 * Event listener for Enter key in subtask input
 * Triggers subtask creation when Enter is pressed
 * @param {KeyboardEvent} event - The keyboard event object
 */
subtaskInputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    setSubtask();
  }
});
