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
    // console.log(element.subtask);

    if (element.status == "toDo") {
      toDo.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask.length, element.assigned, element.prio);
    }
    if (element.status == "progress") {
      progress.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask.length, element.assigned, element.prio);
    }
    if (element.status == "feedback") {
      feedback.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask.length, element.assigned, element.prio);
    }
    if (element.status == "done") {
      done.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask.length, element.assigned, element.prio);
    }
    addProfilesToCard(key, element.assigned);
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
      overlappingProfileImg(refProfile);
    }
  }
}

// function managenSubtasks(params) {}

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

// TEST LIST
let contacts = {
  red: "Dobric Aldin",
  green: "Robby Runge",
  yellow: "Simon Burlet",
};

let subtaskList = {
  0: "test1",
  1: "test2",
  2: "test3",
};

displayCardOnBoard();
const today = taskTemplate(0, "TEST1", "TESTTESTTEST", contacts, "21.01.2036", "Low", "User Task", subtaskList, "progress"); // Test Data
// addTaskToFireBase("tasks", today);

function overlappingProfileImg(refProfileContainer) {
  for (let index = 0; index < refProfileContainer.length; index++) {
    const element = refProfileContainer[index];
    return element;
  }
}
