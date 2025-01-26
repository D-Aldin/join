BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
const toDo = document.querySelector("#toDo");
const progress = document.querySelector("#progress");
const feedback = document.querySelector("#feedback");
const done = document.querySelector("#done");
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
  const category = event.target;
  let data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
  let newStatus = event.target.id;
  let statusUpdate = {
    status: newStatus,
  };
  updateStatusInDB("tasks", cardID, statusUpdate);
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
    if (element.status == "toDo") {
      toDo.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask, element.assigned, element.prio);
    }
    if (element.status == "progress") {
      progress.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask, element.assigned, element.prio);
    }
    if (element.status == "feedback") {
      feedback.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask, element.assigned, element.prio);
    }
    if (element.status == "done") {
      done.innerHTML += renderCard(element.id, element.category, element.title, element.description, element.subtask, element.assigned, element.prio);
    }
  }
}

displayCardOnBoard();
const today = taskTemplate(0, "Task2", "This is a new Test Test Test", "TL", "26.01.2036", "Medium", "User Task", "Subtask", "progress"); // Test Data
