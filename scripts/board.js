BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const toDo = document.querySelector("#toDo");
const progress = document.querySelector("#progress");
const feedback = document.querySelector("#feedback");
const done = document.querySelector("#done");
const refProfile = document.getElementsByClassName("profile");
let cardID;

function draggedElementID(event) {
  event.target.addEventListener("dragstart", () => {
    event.target.classList.add("rotate");
  });
  event.target.addEventListener("dragend", () => {
    event.target.classList.remove("rotate");
  });
  event.dataTransfer.setData("text", event.target.id);
  cardID = event.target.id;
}

function dropPoint(event) {
  event.preventDefault();
  if (event.target.id == "toDo" || event.target.id == "progress" || event.target.id == "feedback" || event.target.id == "done") {
    let data = event.dataTransfer.getData("text");

    event.target.appendChild(document.getElementById(data));
    let newStatus = event.target.id;
    let statusUpdate = {
      status: newStatus,
    };
    updateStatusInDB("tasks", cardID, statusUpdate);
  }
}

function allowDrop() {
  event.preventDefault();
}

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

async function changeData(path = "") {}

function taskTemplate(id, title, description, assigned, date, prio, category, subtask, status) {
  return {
    [id]: {
      id: id,
      title: title,
      description: description,
      assigned: assigned,
      data: date,
      prio: prio,
      category: category,
      subtask: subtask,
      status: status,
    },
  };
}

async function fetchTasks(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

async function addTaskToFireBase(path = "", card) {
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

//TODO  reduce lines of code
async function displayCardOnBoard() {
  let taskFromFireBase = await fetchTasks("tasks");

  for (const key in taskFromFireBase) {
    const element = taskFromFireBase[key];
    const subtasksCompleted = await countCompletedSubtasks(element.subtask);

    if (element.status == "toDo") {
      toDo.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, element.subtask.length, element.assigned, element.prio);
    }
    if (element.status == "progress") {
      progress.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, element.subtask.length, element.assigned, element.prio);
    }
    if (element.status == "feedback") {
      feedback.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, element.subtask.length, element.assigned, element.prio);
    }
    if (element.status == "done") {
      done.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, element.subtask.length, element.assigned, element.prio);
    }
    addProfilesToCard(key, element.assigned);
    calPercentageOfCompletedSubtasks(element.subtask.length, subtasksCompleted);
  }
  noTaskToDo();
}

function addProfilesToCard(id, obj) {
  let transX = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const name = initials(obj[key]);
      const color = key;
      document.getElementById(id).lastElementChild.firstElementChild.innerHTML += contactTamplate(name, color, transX);
      transX += 30;
    }
  }
}

function initials(name) {
  let fullName = name.split(" ");
  let firstName = fullName[0].slice(0, 1);
  let secondName = fullName[1].slice(0, 1);
  let initials = firstName + secondName;
  return initials;
}

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
  }, 130);
}

async function countCompletedSubtasks(subtask) {
  let countTrue = 0;
  for (let index = 0; index < subtask.length; index++) {
    const element = subtask[index];
    if (element.state === true) {
      countTrue += 1;
    }
  }
  return countTrue;
}

function calPercentageOfCompletedSubtasks(numberOfSubtasks, completedSubtasks) {
  const result = (completedSubtasks / numberOfSubtasks) * 100;
  document.querySelector(".progress_bar").style.width = `${result}%`;
}

// ------------------------- TEST LIST
let contacts = {
  red: "Dobric Aldin",
  green: "Robby Runge",
  yellow: "Simon Burlet",
};

let subtaskList = {
  0: { task: "NewTask1", state: false },
};

displayCardOnBoard();
const today = taskTemplate(2, "TEST3", "Work in progress", contacts, "02.02.2025", "Low", "User Task", subtaskList, "progress"); // Test Data
// addTaskToFireBase("tasks", today);

// percentageCalSubtask();
