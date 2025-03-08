const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
let tasksInBoard = document.querySelector("#current_number_tasks_in_board");
let tasksInProgress = document.querySelector("#current_number_tasks_in_progress");
let tasksInFeedback = document.querySelector("#current_number_awaiting_feedback");
let tasksInToDo = document.querySelector("#current_number_to_do");
let tasksDone = document.querySelector("#current_number_done");
let urgentTasks = document.querySelector("#current_number_urgent");
let progressCount = 0;
let feedbackCount = 0;
let toDoCount = 0;
let doneCount = 0;

function init() {
  setGreeting();
  setAccountInitialsSubmenu();
  totalNumberOfTasks();
  countTasks();
  countTheNumberOfUrgentTasks();
}

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

async function fetchTasks(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

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

function updateSummary(progress, feedback, toDo, done) {
  tasksInProgress.innerHTML = progress;
  tasksInFeedback.innerHTML = feedback;
  tasksInToDo.innerHTML = toDo;
  tasksDone.innerHTML = done;
}

async function countTheNumberOfUrgentTasks() {
  const dataFromFireBase = await fetchTasks("tasks");
  if (!dataFromFireBase) return handleNoTasks();
  const { urgentCount, earliestDeadline } = getUrgentTasksInfo(dataFromFireBase);
  updateUrgentTasksUI(urgentCount, earliestDeadline);
}

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

function handleNoTasks() {
  urgentTasks.innerHTML = 0;
  document.querySelector(".date_deadline").innerHTML = "No Deadlines";
  document.querySelector(".text_deadline").innerHTML = "No Urgent Tasks";
}

document.addEventListener("DOMContentLoaded", function () {
  const welcomeMessage = document.getElementById("welcome_message");
  const mainContent = document.querySelector(".main_content");
  welcomeMessage.addEventListener("animationend", function () {
    welcomeMessage.style.display = "none";
    mainContent.style.display = "block";
  });
});
