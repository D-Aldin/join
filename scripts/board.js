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

// function taskTemplate(id, title, description, assigned, date, prio, category, subtask, status) {
//   return {
//     [id]: {
//       id: id,
//       title: title,
//       description: description || " ",
//       assigned: assigned,
//       date: date,
//       prio: prio || " ",
//       category: category,
//       subtask: subtask || [],
//       status: status || "toDo",
//     },
//   };
// }

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

//TODO  reduce lines of code
async function displayCardOnBoard() {
  let taskFromFireBase = await fetchTasks("tasks");
  for (const key in taskFromFireBase) {
    const element = taskFromFireBase[key];
    if (!element) continue;
    const subtaskArray = Array.isArray(element.subtask) ? element.subtask : [];
    const subtasksCompleted = await countCompletedSubtasks(subtaskArray);
    const totalSubtasks = subtaskArray.length;
    console.log(element.user);
    console.log(localStorage.userId);

    if (element.user === localStorage.userId) {
      if (element.status == "toDo") {
        toDo.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, totalSubtasks, element.prio);
      }
      if (element.status == "progress") {
        progress.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, totalSubtasks, element.prio);
      }
      if (element.status == "feedback") {
        feedback.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, totalSubtasks, element.prio);
      }
      if (element.status == "done") {
        done.innerHTML += renderCard(element.id, element.category, element.title, element.description, subtasksCompleted, totalSubtasks, element.prio);
      }
      calPercentageOfCompletedSubtasks(totalSubtasks, subtasksCompleted, element.id);
      addProfilesToCard(key, element.assigned);
    }
  }

  noTaskToDo();
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
  }, 130);
}

async function countCompletedSubtasks(subtask) {
  if (!Array.isArray(subtask) || subtask.length === undefined) {
    return 0;
  }
  let countTrue = 0;
  for (let index = 0; index < subtask.length; index++) {
    const element = subtask[index];
    if (element === null) {
      continue;
    }
    if (element.state === true) {
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
  if (list.length === 0) {
    contactObject = {};
  } else {
    for (let index = 0; index < list.length; index++) {
      const dataFromFireBase = await fetchTasks(`contacts/${list[index]}`);
      temporarilyObject = {
        [list[index]]: {
          color: dataFromFireBase.color,
          name: dataFromFireBase.name,
        },
      };
      Object.assign(contactObject, temporarilyObject);
    }
  }
  return contactObject;
}

async function initialize() {
  displayCardOnBoard();
}

// -------------------------------------------------------------------- TEST LIST TEST TEST TEST TEST --------------------------------

let assigContacts = [];
let subtaskList = {
  0: { task: "write function 1", state: false },
  1: { task: "write function 2", state: false },
  2: { task: "write function 3", state: false },
};
