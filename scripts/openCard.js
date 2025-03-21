/**
 * Stores a reference to the currently selected card.
 * @type {HTMLElement | null}
 */
let card;

/**
 * Stores the ID of the currently selected task card.
 * @type {string | null}
 */
let idOfcurrentElement;

/** The base path for fetching task data. */
const taskPath = "tasks";

/** Stores the list of assigned users when opening a card. */
let assignNewContList = [];

/** Reference to the card container in the overlay. */
let refCardBox = document.getElementById("box");

/** Reference to all close buttons in the overlay. */
const refCloseBtn = document.getElementsByClassName("closeBtn");

/** Reference to the edit button inside the overlay. */
const refEditButton = document.querySelector(".position_edit");

/** Stores the current card's title. */
let titleValue;

/** Stores the current card's description. */
let descriptionValue;

/** Stores the current card's due date. */
let dateValue;

/** Reference to the Task Delete Message*/
const refTaskDeleteMsg = document.querySelector(".task_deleted_msg");

/**
 * Displays the overlay with detailed task information.
 * @param {Event} event - The event object from the clicked element.
 */
function overlayOn(event) {
  const overlay = document.getElementById("overlay");
  const cardContent = document.getElementById("box");
  overlay.style.display = "block";
  overlay.style.animation = "fadeIn 125ms ease-in-out forwards";
  cardContent.style.animation = "slideInFromRight 125ms ease-in-out forwards";
  idOfcurrentElement = event.currentTarget.id;
  document.querySelector("header").style.zIndex = "0";
  document.querySelector("aside").style.zIndex = "0";
}

/**
 * Hides the overlay and refreshes the board.
 */
function overlayOff() {
  const overlay = document.getElementById("overlay");
  const cardContent = document.getElementById("box");
  overlay.style.animation = "fadeOut 125ms ease-in-out forwards";
  cardContent.style.animation = "slideOutToRight 125ms ease-in-out forwards";
  document.querySelector("header").style.zIndex = "1";
  document.querySelector("aside").style.zIndex = "1";
  setTimeout(() => {
    overlay.style.display = "none";
    refreshPageWhenOverlayOff();
  }, 125);
}

/**
 * Stops event bubbling to prevent unintended actions.
 * @param {Event} event - The event object.
 */
function stopEventBubbel(event) {
  event.stopPropagation();
}

/**
 * Fetches and displays task details in the overlay.
 * @param {Event} event - The event object from the clicked card.
 */
async function getData(event) {
  let id = event.currentTarget.id;
  const fetchDetails = await fetchCardDetails(taskPath, id);
  const refersToCard = fetchDetails[id];
  refCardBox.innerHTML = HTMLForOpenCard(refersToCard.category, refersToCard.title, refersToCard.description, refersToCard.date, refersToCard.prio, id);
  managenProfilesWhenCardOpen(id);
  renderSubtasks(id);
  titleValue = refersToCard.title;
  descriptionValue = refersToCard.description;
  dateValue = refersToCard.date;
}

/**
 * Fetches task details from the database.
 * @param {string} path - The path to the task data.
 * @param {string} id - The ID of the task.
 * @returns {Promise<Object>} The fetched task data.
 */
async function fetchCardDetails(path = "", id) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  return response.json();
}

/**
 * Loads and displays assigned users when a card is opened.
 * @param {string} id - The ID of the task.
 */
async function managenProfilesWhenCardOpen(id) {
  const dataFromFireBase = await fetchCardDetails(taskPath, id);
  const refAssignedObject = dataFromFireBase[id].assigned;
  let refProfileContainer = document.querySelector(".profiles");
  for (const key in refAssignedObject) {
    if (Object.prototype.hasOwnProperty.call(refAssignedObject, key)) {
      const fullName = refAssignedObject[key].name;
      const name = initials(refAssignedObject[key].name);
      const color = refAssignedObject[key].color;
      refProfileContainer.innerHTML += contactTamplateForOpenCard(name, color, fullName);
    }
  }
}

/**
 * Loads and displays subtasks inside the overlay.
 * @param {string} id - The ID of the task.
 */
async function renderSubtasks(id) {
  let dataFromFireBase = await fetchCardDetails(taskPath, id);
  let refSubtaskContainer = document.querySelector("#subtasks_container");
  const refSubtasks = dataFromFireBase[id].subtask;
  for (const key in refSubtasks) {
    if (Object.prototype.hasOwnProperty.call(refSubtasks, key)) {
      const task = refSubtasks[key].task;
      const state = refSubtasks[key].state;
      const taskID = key;
      refSubtaskContainer.innerHTML += subtasksTamplate(task, taskID);
    }
  }
  managenCheckBoxes(id);
  setCheckboxAttributes(id);
  resizeTitleIfTooLong();
}

/**
 * Adds event listeners to checkboxes to update subtask completion state.
 * @param {string} id - The ID of the task.
 */
async function managenCheckBoxes(id) {
  let refCheckBoxes = document.querySelectorAll("input[type='checkbox']");
  refCheckBoxes.forEach((element) => {
    element.addEventListener("change", (e) => {
      let idOfTask = e.currentTarget.id;
      let newState = { state: element.checked };
      updateSubtaskState(taskPath, id, idOfTask, newState);
    });
  });
}

/**
 * Updates the state of a subtask in the database.
 * @param {string} path - The base path for the task.
 * @param {string} taskID - The ID of the main task.
 * @param {string} subtaskID - The ID of the subtask.
 * @param {Object} state - The updated state of the subtask.
 */
async function updateSubtaskState(path = "", taskID, subtaskID, state) {
  let response = await fetch(`${BASE_URL}/${path}/${taskID}/subtask/${subtaskID}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });
  return response.json();
}

/**
 * Sets the "checked" attribute for subtasks based on their completion state.
 * @param {string} id - The ID of the task.
 */
async function setCheckboxAttributes(id) {
  let response = await fetchCardDetails(`tasks/${id}/subtask`, id);
  for (const subtask in response) {
    if (Object.prototype.hasOwnProperty.call(response, subtask)) {
      const element = response[subtask];
      let checkbox = document.querySelector(`#${subtask}`);
      if (element.state === true) {
        checkbox.setAttribute("checked", "true");
      } else {
        checkbox.removeAttribute("checked");
      }
    }
  }
}

/**
 * Refreshes the task board after closing the overlay.
 */
function refreshPageWhenOverlayOff() {
  toDo.innerHTML = "";
  progress.innerHTML = "";
  feedback.innerHTML = "";
  done.innerHTML = "";
  displayCardOnBoard();
}

/**
 * Deletes a task from the database.
 */
async function deleteButton() {
  let response = await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  showTaskDeleteMsg();
  overlayOff();
  hideTaskDeleteMsg();
  return response.json();
}

/** Give feedback to the user when a task is deleted.  */
function showTaskDeleteMsg() {
  refTaskDeleteMsg.classList.remove("msg_d_none");
  refTaskDeleteMsg.style.animation = "slideInFromRight 125ms ease forwards";
}

/**
 * Hides the task deletion message with an animation after a delay.
 * First waits 900ms, then applies a 125ms slide-out animation,
 * and finally adds the d_none class to completely hide the element
 * after the animation completes.
 */
function hideTaskDeleteMsg() {
  setTimeout(() => {
    refTaskDeleteMsg.style.animation = "slideOutToRight 125ms ease forwards";
    setTimeout(() => {
      refTaskDeleteMsg.classList.add("msg_d_none");
    }, 125);
  }, 900);
}

/**
 * Resizes the card title if it is too long.
 */
function resizeTitleIfTooLong() {
  const cardTitle = document.querySelector(".open_card_title");
  if (cardTitle.innerHTML.length > 35) {
    cardTitle.style.fontSize = "3rem";
  }
}
