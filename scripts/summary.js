/** Base URL for the Firebase database */
const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

/** DOM element for displaying total tasks count */
let tasksInBoard = document.querySelector("#current_number_tasks_in_board");
/** DOM element for displaying in-progress tasks count */
let tasksInProgress = document.querySelector("#current_number_tasks_in_progress");
/** DOM element for displaying awaiting feedback tasks count */
let tasksInFeedback = document.querySelector("#current_number_awaiting_feedback");
/** DOM element for displaying to-do tasks count */
let tasksInToDo = document.querySelector("#current_number_to_do");
/** DOM element for displaying completed tasks count */
let tasksDone = document.querySelector("#current_number_done");
/** DOM element for displaying urgent tasks count */
let urgentTasks = document.querySelector("#current_number_urgent");

/** Counter for tasks in progress */
let progressCount = 0;
/** Counter for tasks awaiting feedback */
let feedbackCount = 0;
/** Counter for tasks in to-do status */
let toDoCount = 0;
/** Counter for completed tasks */
let doneCount = 0;

/**
 * Initializes the summary page
 * Sets greeting, account initials, and loads task statistics
 */
function init() {
  setGreeting();
  setAccountInitialsSubmenu();
  totalNumberOfTasks();
  countTasks();
  countTheNumberOfUrgentTasks();
}

/**
 * Sets the greeting message based on time of day and displays the user's name
 * @async
 */
async function setGreeting() {
  let hour = new Date().getHours();
  let greeting;
  if (hour < 10) {
    greeting = "Good morning,";
  } else if (hour < 17) {
    greeting = "Good afternoon,";
  } else if (hour < 22) {
    greeting = "Good evening,";
  } else {
    greeting = "Good night,";
  }
  document.getElementById("time_message").innerHTML = greeting;
  let userName = await getUserName();
  document.querySelector(".account_name").innerHTML = userName;
}

/**
 * Fetches data from Firebase database
 * @async
 * @param {string} path - Optional path segment to append to the base URL
 * @returns {Promise<Object>} The fetched data in JSON format
 */
async function fetchTasks(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

/**
 * Counts and displays the total number of tasks for the current user
 * @async
 */
async function totalNumberOfTasks() {
  count = 0;
  const dataFromFireBase = await fetchTasks("tasks");
  for (const task in dataFromFireBase) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase, task)) {
      const user = dataFromFireBase[task].user;
      if (user === localStorage.userId) {
        count += 1;
      }
    }
  }
  tasksInBoard.innerHTML = count;
}

/**
 * Counts tasks by status category and updates the summary display
 * @async
 */
async function countTasks() {
  const dataFromFireBase = await fetchTasks("tasks");
  if (!dataFromFireBase) return;
  const validTasks = Object.values(dataFromFireBase).filter(Boolean);
  for (const task in validTasks) {
    if (Object.prototype.hasOwnProperty.call(validTasks, task)) {
      processTaskStatus(validTasks, task);
    }
  }
  updateSummary(progressCount, feedbackCount, toDoCount, doneCount);
}

/**
 * Processes a single task to determine its status and increment the appropriate counter
 * @param {Object[]} validTasks - Array of task objects
 * @param {number|string} task - Index of the task to process
 */
function processTaskStatus(validTasks, task) {
  const user = validTasks[task].user;
  const status = validTasks[task].status;
  if (user === localStorage.userId) {
    if (status === "progress") progressCount++;
    else if (status === "feedback") feedbackCount++;
    else if (status === "toDo") toDoCount++;
    else if (status === "done") doneCount++;
  }
}

/**
 * Updates the task count summary in the UI
 * @param {number} progress - Count of tasks in progress
 * @param {number} feedback - Count of tasks awaiting feedback
 * @param {number} toDo - Count of to-do tasks
 * @param {number} done - Count of completed tasks
 */
function updateSummary(progress, feedback, toDo, done) {
  tasksInProgress.innerHTML = progress;
  tasksInFeedback.innerHTML = feedback;
  tasksInToDo.innerHTML = toDo;
  tasksDone.innerHTML = done;
}

/**
 * Counts urgent tasks and finds the earliest deadline
 * @async
 */
async function countTheNumberOfUrgentTasks() {
  const dataFromFireBase = await fetchTasks("tasks");
  if (!dataFromFireBase) return handleNoTasks();
  const { urgentCount, earliestDeadline } = getUrgentTasksInfo(dataFromFireBase);
  updateUrgentTasksUI(urgentCount, earliestDeadline);
}

/**
 * Analyzes tasks data to count urgent tasks and find the earliest deadline
 * @param {Object} tasks - Tasks data from Firebase
 * @returns {Object} Object containing urgent task count and earliest deadline date
 */
function getUrgentTasksInfo(tasks) {
  let urgentCount = 0;
  let earliestDeadline = null;
  Object.values(tasks).forEach((task) => {
    if (task.user === localStorage.userId && task.prio === "urgent") {
      urgentCount++;
      if (task.date) {
        const taskDate = new Date(task.date);
        if (!earliestDeadline || taskDate < earliestDeadline) earliestDeadline = taskDate;
      }
    }
  });
  return { urgentCount, earliestDeadline };
}

/**
 * Updates the UI with urgent tasks count and deadline information
 * @param {number} count - Number of urgent tasks
 * @param {Date|null} deadline - The earliest deadline date or null if none exists
 */
function updateUrgentTasksUI(count, deadline) {
  urgentTasks.innerHTML = count;
  if (deadline) {
    const options = { month: "long", day: "numeric", year: "numeric" };
    document.querySelector(".date_deadline").innerHTML = deadline.toLocaleDateString("en-US", options);
    document.querySelector(".text_deadline").innerHTML = "Upcoming Deadline";
  } else {
    document.querySelector(".date_deadline").innerHTML = "No Deadlines";
    document.querySelector(".text_deadline").innerHTML = "No Urgent Tasks";
  }
}

/**
 * Updates UI when there are no tasks
 */
function handleNoTasks() {
  urgentTasks.innerHTML = 0;
  document.querySelector(".date_deadline").innerHTML = "No Deadlines";
  document.querySelector(".text_deadline").innerHTML = "No Urgent Tasks";
}

/**
 * Handles the welcome animation and transitions to the main content
 */
document.addEventListener("DOMContentLoaded", function () {
  const welcomeMessage = document.getElementById("welcome_message");
  const mainContent = document.querySelector(".main_content");
  welcomeMessage.addEventListener("animationend", function () {
    welcomeMessage.style.display = "none";
    mainContent.style.display = "block";
  });
});
