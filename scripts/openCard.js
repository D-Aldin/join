let card;
let refCardBox = document.getElementById("box");

function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

function stopEventBubbel(event) {
  event.stopPropagation();
}

async function getData(event) {
  let id = event.currentTarget.id;
  const fetchDetails = await fetchCardDetails("tasks", id);
  const refersToCard = fetchDetails[id];
  refCardBox.innerHTML = HTMLForOpenCard(refersToCard.category, refersToCard.title, refersToCard.description, refersToCard.data, refersToCard.prio);
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
  const dataFromFireBase = await fetchCardDetails("tasks", id);
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
  let dataFromFireBase = await fetchCardDetails("tasks", id);
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
        element.setAttribute("checked", true);
        updateSubtaskState("tasks", id, index, newState);
      }
      if (element.checked === false) {
        let newState = {
          state: false,
        };
        updateSubtaskState("tasks", id, index, newState);
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

async function setCheckboxAttributes() {}
