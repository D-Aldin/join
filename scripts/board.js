/**
 * Base URL for Firebase database
 * @constant {string}
 */
const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

/** @type {HTMLElement} */
const toDo = document.querySelector("#toDo");
/** @type {HTMLElement} */
const progress = document.querySelector("#progress");
/** @type {HTMLElement} */
const feedback = document.querySelector("#feedback");
/** @type {HTMLElement} */
const done = document.querySelector("#done");
/** @type {NodeListOf<Element>} */
let dropZones = document.querySelectorAll("section");

/** @type {string} ID of dragged card */
let cardID;
/** @type {Array} Assigned contacts */
let assigContacts = [];

/**
 * Handles drag event to store the dragged element's ID and add rotation effect.
 * @param {DragEvent} event - The drag event.
 */
function draggedElementID(event) {
  highlightDropPoint(event);
  event.target.addEventListener("dragstart", () => event.target.classList.add("rotate"));
  event.target.addEventListener("dragend", () => {
    event.target.classList.remove("rotate");
    document.querySelector(".highlight_box")?.remove();
  });
  event.dataTransfer.setData("text", event.target.id);
  cardID = event.target.id;
}

/**
 * Highlights drop zones when dragging an element over them.
 * @param {DragEvent} dragevent - The drag event.
 */
function highlightDropPoint(dragevent) {
  dropZones.forEach((zone) => {
    zone.addEventListener("dragenter", () => {
      if (!zone.contains(dragevent.target) && !zone.querySelector(".highlight_box")) {
        let box = document.createElement("div");
        box.classList.add("highlight_box");
        zone.lastElementChild.appendChild(box);
      }
    });
    zone.addEventListener("dragleave", () => document.querySelector(".highlight_box")?.remove());
  });
}

/**
 * Handles dropping of a task and updates its status in Firebase.
 * @param {DragEvent} event - The drop event.
 */
function dropPoint(event) {
  event.preventDefault();
  const targetId = event.target.id;
  if (["toDo", "progress", "feedback", "done"].includes(targetId)) {
    const data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data));
    updateStatusInDB("tasks", cardID, { status: targetId });
  }
}

/**
 * Allows drop events on valid elements.
 * @param {DragEvent} event - The event object.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Updates task status in Firebase.
 * @async
 * @param {string} path - Database path.
 * @param {string} idNumber - Task ID.
 * @param {Object} status - Status object.
 */
async function updateStatusInDB(path, idNumber, status) {
  await fetch(`${BASE_URL}/${path}/${idNumber}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(status),
  });
  noTaskToDo();
}

/**
 * Fetches tasks from Firebase.
 * @async
 * @param {string} path - Database path.
 * @returns {Promise<Object>} - Task data.
 */
async function fetchTasks(path) {
  const response = await fetch(`${BASE_URL}/${path}.json`, { method: "GET" });
  return response.json();
}

/**
 * Displays task cards on the board.
 * @async
 */
async function displayCardOnBoard() {
  const tasks = await fetchTasks("tasks");
  for (const key in tasks) {
    const task = tasks[key];
    if (!task || task.user !== localStorage.userId) continue;
    const subtasksCompleted = task.subtask ? Object.values(task.subtask).filter((sub) => sub.state).length : 0;
    const totalSubtasks = task.subtask ? Object.keys(task.subtask).length : 0;
    renderTaskCard(task, subtasksCompleted, totalSubtasks);
    calPercentageOfCompletedSubtasks(totalSubtasks, subtasksCompleted, task.id);
    addProfilesToCard(key, task.assigned);
  }
  noTaskToDo();
}

/**
 * Renders a task card in the correct column.
 * @param {Object} task - Task object.
 * @param {number} subtasksCompleted - Completed subtasks count.
 * @param {number} totalSubtasks - Total subtasks count.
 */
function renderTaskCard(task, subtasksCompleted, totalSubtasks) {
  const columns = { toDo, progress, feedback, done };
  if (columns[task.status]) {
    columns[task.status].innerHTML += renderCard(task.id, task.category, task.title, task.description, subtasksCompleted, totalSubtasks, task.prio);
  }
}

/**
 * Updates task placeholders when no tasks are present.
 */
function noTaskToDo() {
  const placeholders = {
    toDo: "No Tasks To Do",
    progress: "No Tasks In Progress",
    feedback: "No Tasks Await Feedback",
    done: "No Tasks Done",
  };
  setTimeout(() => {
    Object.entries(placeholders).forEach(([key, text]) => {
      const element = document.getElementById(`placeholder${key.charAt(0).toUpperCase() + key.slice(1)}`);
      element.classList.toggle("no_task", !document.getElementById(key).lastElementChild);
      element.innerHTML = document.getElementById(key).lastElementChild ? "" : text;
    });
  }, 125);
}

/**
 * Calculates and updates the progress bar for subtasks.
 * @param {number} total - Total subtasks.
 * @param {number} completed - Completed subtasks.
 * @param {string} id - Task ID.
 */
function calPercentageOfCompletedSubtasks(total, completed, id) {
  const percentage = (completed / total) * 100;
  document.getElementById(`progress_bar${id}`).style.width = `${percentage}%`;
}

/**
 * Initializes the Kanban board by loading tasks.
 */
async function initialize() {
  await displayCardOnBoard();
}
