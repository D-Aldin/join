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
  let refTitleInputField = (document.querySelector("#editTitle").value = dataFromFireBase[storeTheID].title);
  let refDescriptionField = (document.querySelector("#editDescription").value = dataFromFireBase[storeTheID].description);
  let refDateField = (document.querySelector("#editDate").value = dataFromFireBase[storeTheID].data);
  displayContactsInDropdownMenu();
  editPriority(dataFromFireBase[storeTheID].prio);
  for (const key in dataFromFireBase[storeTheID].assigned) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase[storeTheID].assigned, key)) {
      const profile = initials(dataFromFireBase[storeTheID].assigned[key]);
      document.querySelector(".assigned_to").innerHTML += `<div class="circle circle_profile_names spacing" style="background-color: ${key}">${profile}</div>`;
    }
  }
}

function editPriority(data) {
  let urgent = document.getElementById("urgent");
  let medinu = document.getElementById("medium");
  let low = document.getElementById("low");
  switch (data) {
    case "Urgent":
      {
        urgent.style.backgroundColor = "rgb(255, 61, 0)";
        urgent.style.color = "white";
        document.getElementById("urgentImageEditBtn").src = "./assets/icons/addTask/icon_clicket_urgent.svg";
        urgent.classList.add("no_hover");
      }
      break;
    case "Medium":
      {
        medinu.style.backgroundColor = "rgb(255, 168, 0)";
        medinu.style.color = "white";
        document.getElementById("mediumImageEditBtn").src = "./assets/icons/addTask/icon_clicket_medium.svg";
        medinu.classList.add("no_hover");
      }
      break;
    case "Low": {
      low.style.backgroundColor = "rgb(122, 226, 41)";
      low.style.color = "white";
      document.getElementById("lowImageEditBtn").src = "./assets/icons/addTask/icon_clicket_low.svg";
      low.classList.add("no_hover");
    }
  }
}

async function displayContactsInDropdownMenu() {
  let dataFromFireBase = await fetchCardDetails("contacts", storeTheID);
  for (const key in dataFromFireBase) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase, key)) {
      const profile = dataFromFireBase[key];
      const profileInitials = initials(profile.name);
      document.querySelector(".content").innerHTML += `<div class="align_items" id_value=${key}>
                                                            <div class="icon_name_container">
                                                              <div class="circle circle_profile_names spacing" style="background-color: ${profile.color}">${profileInitials}</div>
                                                              ${profile.name}
                                                            </div>
                                                            <div>
                                                              <img src="./assets/icons/checkbox/openCardRectangle.svg" alt="" srcset="">
                                                            </div>
                                                        </div> 
                                                         `;
    }
  }
}

async function editingContacts(event) {}
