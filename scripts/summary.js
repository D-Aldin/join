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
  for (const key in dataFromFireBase) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase, key)) {
      const user = dataFromFireBase[key].user;
      console.log(user);

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
  let progressCount = 0;
  let feedbackCount = 0;
  let toDoCount = 0;
  let doneCount = 0;

  validTasks.forEach((task) => {
    switch (task.status) {
      case "progress":
        progressCount += 1;
        break;
      case "feedback":
        feedbackCount += 1;
        break;
      case "toDo":
        toDoCount += 1;
        break;
      case "done":
        doneCount += 1;
        break;
    }
  });
  tasksInProgress.innerHTML = progressCount;
  tasksInFeedback.innerHTML = feedbackCount;
  tasksInToDo.innerHTML = toDoCount;
  tasksDone.innerHTML = doneCount;
}

async function countTheNumberOfUrgentTasks() {
  const dataFromFireBase = await fetchTasks("tasks");
  if (!dataFromFireBase) {
    urgentTasks.innerHTML = 0;
    return;
  }
  const validTasks = Object.values(dataFromFireBase).filter(Boolean);
  const counter = validTasks.filter((task) => task.prio === "urgent").length;
  urgentTasks.innerHTML = counter;
}
