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

function draggedElementID(event) {
  highlightDropPoint(event);
  event.target.addEventListener("dragstart", () => {
    event.target.classList.add("rotate");
  });
  event.target.addEventListener("dragend", () => {
    event.target.classList.remove("rotate");
    let highlightBox = document.querySelector(".highlight_box");
    if (highlightBox) highlightBox.remove();
  });
  event.dataTransfer.setData("text", event.target.id);
  cardID = event.target.id;
}

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

async function fetchTasks(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = await response.json();
  return responseToJSON;
}

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
}

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
  window.addEventListener("resize", ifNoTaskResizeContainer);
}

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

function calPercentageOfCompletedSubtasks(numberOfSubtasks, completedSubtasks, id) {
  const result = (completedSubtasks / numberOfSubtasks) * 100;
  document.getElementById("progress_bar" + id).style.width = `${result}%`;
}

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

async function initialize() {
  displayCardOnBoard();
}

function ifNoTaskResizeContainer() {
  document.querySelectorAll("#toDo, #progress, #feedback, #done").forEach((section) => {
    if (section.children.length > 0 && window.innerWidth < 1200) {
      section.style.height = "300px";
    } else {
      section.style.height = "80px";
    }
  });
}

function setColorOfCategory() {
  const refCategory = document.querySelectorAll(".category");
  refCategory.forEach((element) => {
    if (element.innerHTML === "Technical Task") {
      element.style.backgroundColor = "rgb(31, 215, 193)";
      element.style.width = "8rem";
    }
  });
}
