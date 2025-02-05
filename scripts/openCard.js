let card;
let storeTheID;
const taskPath = "tasks";
let refCardBox = document.getElementById("box");
const refCloseBtn = document.getElementsByClassName("closeBtn");
const refEditButton = document.querySelector(".position_edit");

function overlayOn(event) {
  document.getElementById("overlay").style.display = "block";
  storeTheID = event.currentTarget.id;
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
  refreshPageWhenOverlayOff();
}

function stopEventBubbel(event) {
  event.stopPropagation();
}

async function getData(event) {
  let id = event.currentTarget.id;
  const fetchDetails = await fetchCardDetails(taskPath, id);
  const refersToCard = fetchDetails[id];
  refCardBox.innerHTML = HTMLForOpenCard(refersToCard.category, refersToCard.title, refersToCard.description, refersToCard.data, refersToCard.prio, id);
  managenProfilesWhenCardOpen(id);
  renderSubtasks(id);
}

async function fetchCardDetails(path = "", id) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = response.json();
  let result = await responseToJSON;
  return result;
}

async function managenProfilesWhenCardOpen(id) {
  const dataFromFireBase = await fetchCardDetails(taskPath, id);
  const refAssignedObject = dataFromFireBase[id].assigned;
  let refProfileContainer = document.querySelector(".profiles");

  for (const key in refAssignedObject) {
    if (Object.prototype.hasOwnProperty.call(refAssignedObject, key)) {
      const fullName = refAssignedObject[key];
      const name = initials(refAssignedObject[key]);
      const color = key;
      refProfileContainer.innerHTML += contactTamplateForOpenCard(name, color, fullName);
    }
  }
}

async function renderSubtasks(id) {
  let dataFromFireBase = await fetchCardDetails(taskPath, id);
  let refSubtaskContainer = document.querySelector("#subtasks_container");
  const refSubtasks = dataFromFireBase[id].subtask;
  for (const key in refSubtasks) {
    if (Object.prototype.hasOwnProperty.call(refSubtasks, key)) {
      const task = refSubtasks[key].task;
      const state = refSubtasks[key].state;
      const taskID = key;
      refSubtaskContainer.innerHTML += subtasksTamplate(task, taskID);
    }
  }
  managenCheckBoxes(id);
  setCheckboxAttributes(id);
}

async function managenCheckBoxes(id) {
  let refCheckBoxes = document.querySelectorAll("input[type='checkbox']");
  for (let index = 0; index < refCheckBoxes.length; index++) {
    const element = refCheckBoxes[index];
    element.addEventListener("change", () => {
      if (element.checked) {
        let newState = {
          state: true,
        };
        updateSubtaskState(taskPath, id, index, newState);
      }
      if (element.checked === false) {
        let newState = {
          state: false,
        };
        updateSubtaskState(taskPath, id, index, newState);
      }
    });
  }
}

async function updateSubtaskState(path = "", taskID, subtaskID, state) {
  let response = await fetch(`${BASE_URL}/${path}/${taskID}/subtask/${subtaskID}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(state),
  });
  const responseData = await response.json();
}

async function setCheckboxAttributes(id) {
  let response = await fetchCardDetails(taskPath, id);
  let refToSubtask = response[id].subtask;
  for (let index = 0; index < refToSubtask.length; index++) {
    const element = refToSubtask[index];
    if (element.state == false) {
      document.getElementById(`subtask${index}`).removeAttribute("checked");
    }
    if (element.state == true) {
      document.getElementById(`subtask${index}`).setAttribute("checked", true);
    }
  }
}

function refreshPageWhenOverlayOff() {
  toDo.innerHTML = "";
  progress.innerHTML = "";
  feedback.innerHTML = "";
  done.innerHTML = "";
  displayCardOnBoard();
}

async function deleteButton() {
  let response = await fetch(`${BASE_URL}/${taskPath}/${storeTheID}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
}

function renderEditMenu() {
  refCardBox.innerHTML = "";
  refCardBox.innerHTML += HTMLTamplateForTheEditFunk();
}

async function editFunction() {
  let dataFromFireBase = await fetchCardDetails(taskPath, storeTheID);
  let title = dataFromFireBase[storeTheID].title;
  let description = dataFromFireBase.description;
  console.log(title);
}
