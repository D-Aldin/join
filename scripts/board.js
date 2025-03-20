BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const toDo = document.querySelector("#toDo");
const progress = document.querySelector("#progress");
const feedback = document.querySelector("#feedback");
const done = document.querySelector("#done");
const refProfile = document.getElementsByClassName("profile");
let dropZones = document.querySelectorAll("section");
let cardID;
let assigContacts = [];
let windowWidth;
let startPosition;
let sectionList = [toDo, progress, feedback, done];

/**
 * Handles the drag event by adding rotation to the dragged element.
 * @param {Event} event - The drag event.
 */
function draggedElementID(event) {
  highlightDropPoint(event);
  event.target.classList.add("rotate");
  event.target.addEventListener("dragend", () => {
    event.target.classList.remove("rotate");
    let highlightBox = document.querySelector(".highlight_box");
    if (highlightBox) highlightBox.remove();
  });
  event.dataTransfer.setData("text", event.target.id);
  cardID = event.target.id;
}

/**
 * Highlights the drop point while dragging.
 * @param {Event} dragevent - The drag event.
 */
function highlightDropPoint(dragevent) {
  dropZones.forEach((zone) => {
    zone.addEventListener("dragenter", function () {
      if (!zone.contains(dragevent.target) && !zone.contains(document.querySelector(".highlight_box"))) {
        let box = document.createElement("div");
        box.classList.add("highlight_box");
        box.setAttribute("dragover", "allowDrop(event)");
        zone.lastElementChild.appendChild(box);
      }
    });
    zone.addEventListener("dragleave", function () {
      let refBox = document.querySelector(".highlight_box");
      if (refBox) refBox.remove();
    });
  });
}

function dropPoint(event) {
  highlightDropPoint(event);
  event.preventDefault();
  let newStatus;
  let data = event.dataTransfer.getData("text");
  let draggedElement = document.getElementById(data);
  if (event.target.classList.contains("card")) {
    const valueForNewStatus = event.target.closest("section").firstElementChild.nextElementSibling.nextElementSibling.id;
    event.target.before(draggedElement);
    newStatus = valueForNewStatus;
  }
  if (event.target.id == "toDo" || event.target.id == "progress" || event.target.id == "feedback" || event.target.id == "done") {
    event.target.appendChild(document.getElementById(data));
    newStatus = event.target.id;
  }
  let statusUpdate = {
    status: newStatus,
  };
  updateStatusInDB("tasks", cardID, statusUpdate);
  resizeContainers();
}

/**
 * Prevents the default behavior for the drop event.
 */
function allowDrop() {
  event.preventDefault();
}

/**
 * Updates the status of a task in the Firebase database.
 * @async
 * @param {string} path - The Firebase database path.
 * @param {string} idNumber - The task ID.
 * @param {Object} status - The updated status of the task.
 * @returns {Promise<void>}
 */
async function updateStatusInDB(path = "", idNumber, status) {
  let response = await fetch(`${BASE_URL}/${path}/${idNumber}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
  });
  const responseData = await response.json();
  noTaskToDo();
}

/**
 * Fetches tasks from the Firebase database.
 * @async
 * @param {string} path - The Firebase database path.
 * @returns {Promise<Object>} The tasks data.
 */
async function fetchTasks(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

/**
 * Adds data to Firebase at the specified path.
 * @async
 * @param {string} path - The Firebase database path.
 * @param {Object} card - The data to be added.
 * @returns {Promise<Object>} The added data.
 */
async function addDataToFireBase(path = "", card) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(card),
  });
  let responseToJSON = response.json();
  return responseToJSON;
}

/**
 * Displays all tasks from Firebase on the board.
 * @async
 */
async function displayCardOnBoard() {
  let taskFromFireBase = await fetchTasks("tasks");
  for (const key in taskFromFireBase) {
    const element = taskFromFireBase[key];
    if (!element || element.user !== localStorage.userId) continue;
    const subtasksCompleted = element.subtask ? Object.values(element.subtask).filter((sub) => sub.state === true).length : 0;
    const totalSubtasks = element.subtask ? Object.keys(element.subtask).length : 0;
    renderTaskCard(element, subtasksCompleted, totalSubtasks);
    calPercentageOfCompletedSubtasks(totalSubtasks, subtasksCompleted, element.id);
    addProfilesToCard(key, element.assigned);
  }
  noTaskToDo();
  setColorOfCategory();
  shortenContactView();
  resizeContainers();
}

/**
 * Renders a task card in the appropriate section.
 * @param {Object} element - The task data.
 * @param {number} subtasksCompleted - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 */
function renderTaskCard(element, subtasksCompleted, totalSubtasks) {
  const columnMap = {
    toDo: toDo,
    progress: progress,
    feedback: feedback,
    done: done,
  };
  if (columnMap[element.status]) {
    columnMap[element.status].innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, totalSubtasks, element.prio);
  }
}

/**
 * Adds assigned profiles to the task card.
 * @param {string} id - The task ID.
 * @param {Object} obj - The assigned contacts object.
 */
function addProfilesToCard(id, obj) {
  getContactsFromFireBase(assigContacts);
  let transX = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let name = initials(obj[key].name);
      let color = obj[key].color;
      document.getElementById(id).lastElementChild.firstElementChild.innerHTML += contactTamplate(name, color, transX);
      transX += 30;
    }
  }
}

/**
 * Shortens the contact view by removing all child elements after the first four.
 * It then adds a new element indicating how many contacts are hidden.
 *
 * @function shortenContactView
 * @returns {void}
 */
function shortenContactView() {
  const refContacts = document.querySelectorAll(".profile");
  refContacts.forEach((profile) => {
    let totalLength = profile.children.length - 4;
    while (profile.children.length > 4) {
      profile.removeChild(profile.lastChild);
    }
    if (profile.children.length === 4) {
      profile.innerHTML += contactTamplate(`+${totalLength}`, "rgba(230, 23, 8, 0.85)", 140);
    }
  });
}

/**
 * Converts a name to its initials.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
function initials(name) {
  if (typeof name !== "string" || name.trim() === "") {
    return "";
  }
  let fullName = name.trim().split(" ");
  if (fullName.length < 2) {
    return fullName[0]?.slice(0, 1) || "";
  }
  let firstName = fullName[0].slice(0, 1);
  let secondName = fullName[1].slice(0, 1);
  return firstName.toUpperCase() + secondName.toUpperCase();
}

/**
 * Displays a message when there are no tasks in each section.
 */
function noTaskToDo() {
  let noTaskToDo = document.getElementById("placeholderToDo");
  let noTaskInProgress = document.getElementById("placeholderProgress");
  let noTaskAwaitFeedback = document.getElementById("placeholderFeedback");
  let noTaskDone = document.getElementById("placeholderDone");
  setTimeout(() => {
    toDo.lastElementChild == null ? (noTaskToDo.classList.add("no_task"), (noTaskToDo.innerHTML = "No Tasks To Do")) : (noTaskToDo.classList.remove("no_task"), (noTaskToDo.innerHTML = ""));
    progress.lastElementChild == null ? (noTaskInProgress.classList.add("no_task"), (noTaskInProgress.innerHTML = "No Tasks In Progress")) : (noTaskInProgress.classList.remove("no_task"), (noTaskInProgress.innerHTML = ""));
    feedback.lastElementChild == null ? (noTaskAwaitFeedback.classList.add("no_task"), (noTaskAwaitFeedback.innerHTML = "No Tasks Await feedback")) : (noTaskAwaitFeedback.classList.remove("no_task"), (noTaskAwaitFeedback.innerHTML = ""));
    done.lastElementChild == null ? (noTaskDone.classList.add("no_task"), (noTaskDone.innerHTML = "No Tasks Done")) : (noTaskDone.classList.remove("no_task"), (noTaskDone.innerHTML = ""));
  }, 125);
  // window.addEventListener("resize", ifNoTaskResizeContainer);
}

/**
 * Counts the number of completed subtasks for a task.
 * @async
 * @param {Array} subtask - The list of subtasks.
 * @returns {Promise<number>} The number of completed subtasks.
 */
async function countCompletedSubtasks(subtask) {
  if (!Array.isArray(subtask) || subtask.length === undefined) {
    return 0;
  }
  let countTrue = 0;
  for (let index = 0; index < subtask.length; index++) {
    if (subtask[index] === null) {
      continue;
    }
    if (subtask[index].state === true) {
      countTrue += 1;
    }
  }
  return countTrue;
}

/**
 * Calculates the percentage of completed subtasks.
 * @param {number} numberOfSubtasks - The total number of subtasks.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {string} id - The task ID.
 */
function calPercentageOfCompletedSubtasks(numberOfSubtasks, completedSubtasks, id) {
  const result = (completedSubtasks / numberOfSubtasks) * 100;
  document.getElementById("progress_bar" + id).style.width = `${result}%`;
}

/**
 * Fetches contact details from Firebase.
 * @async
 * @param {Array} list - List of assigned contact IDs.
 * @returns {Promise<Object>} The contact details.
 */
async function getContactsFromFireBase(list) {
  let contactObject = {};
  if (list.length === 0) return contactObject;
  for (let index = 0; index < list.length; index++) {
    const dataFromFireBase = await fetchTasks(`contacts/${list[index]}`);
    let temporarilyObject = {
      [list[index]]: {
        color: dataFromFireBase.color,
        name: dataFromFireBase.name,
      },
    };
    Object.assign(contactObject, temporarilyObject);
  }
  return contactObject;
}

/**
 * Initializes the task board by displaying tasks.
 * @async
 */
async function initialize() {
  displayCardOnBoard();
}

/**
 * Resizes the sections if there are no tasks.
 */
function ifNoTaskResizeContainer() {
  document.querySelectorAll("#toDo, #progress, #feedback, #done").forEach((section) => {
    if (section.children.length > 0 && window.innerWidth < 1200) {
      section.style.height = "300px";
    } else {
      section.style.height = "100vh";
    }
  });
}

/**
 * Sets the color of the category in the task card.
 */
function setColorOfCategory() {
  const refCategory = document.querySelectorAll(".category");
  refCategory.forEach((element) => {
    if (element.innerHTML === "Technical Task") {
      element.style.backgroundColor = "rgb(31, 215, 193)";
      element.style.width = "8rem";
    }
  });
}

/**
 * Adjusts the height of all sections in the Kanban board to match the section with the most cards.
 * Each section's height is set based on the number of cards in the section with the highest count.
 *
 * @function resizeContainers
 * @returns {void}
 */
function resizeContainers() {
  if (window.innerWidth > 1200) {
    let sectionWithMostCards = [toDo.children.length, progress.children.length, feedback.children.length, done.children.length].sort().slice(-1)[0];
    sectionList.forEach((section) => {
      section.style.height = `${sectionWithMostCards * 300}px`;
      document.querySelector(`.${section.id}`).style.height = `${sectionWithMostCards * 300}px`;
    });
  }
}

window.addEventListener("resize", () => {
  if (window.innerWidth < 1199) {
    sectionList.forEach((section) => {
      section.style.height = "300px";
    });
  }
});
