let card;
let idOfcurrentElement;
const taskPath = "tasks";
let assignNewContList = [];
let refCardBox = document.getElementById("box");
const refCloseBtn = document.getElementsByClassName("closeBtn");
const refEditButton = document.querySelector(".position_edit");

function overlayOn(event) {
  document.getElementById("overlay").style.display = "block";
  idOfcurrentElement = event.currentTarget.id;
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
      const fullName = refAssignedObject[key].name;
      const name = initials(refAssignedObject[key].name);
      const color = refAssignedObject[key].color;
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
  let refToSubtask = Array.isArray(response[id]?.subtask) ? response[id].subtask : [];

  for (let index = 0; index < refToSubtask.length; index++) {
    const element = refToSubtask[index];
    const checkbox = document.getElementById(`subtask${index}`);

    if (!checkbox) continue; // Ensure the checkbox exists before modifying it

    if (element.state === false) {
      checkbox.removeAttribute("checked");
    }
    if (element.state === true) {
      checkbox.setAttribute("checked", "true");
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
  let response = await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}.json`, {
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
  displaySubtasksInTheEditMenu();
}

async function editFunction() {
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  let refTitleInputField = (document.querySelector("#editTitle").value = dataFromFireBase[idOfcurrentElement].title);
  let refDescriptionField = (document.querySelector("#editDescription").value = dataFromFireBase[idOfcurrentElement].description);
  let refDateField = (document.querySelector("#editDate").value = dataFromFireBase[idOfcurrentElement].data);
  displayContactsInDropdownMenu();
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  for (const key in dataFromFireBase[idOfcurrentElement].assigned) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase[idOfcurrentElement].assigned, key)) {
      const profile = initials(dataFromFireBase[idOfcurrentElement].assigned[key].name);
      const color = dataFromFireBase[idOfcurrentElement].assigned[key].color;
      document.querySelector(".assigned_to").innerHTML += `<div class="circle circle_profile_names spacing" style="background-color: ${color}">${profile}</div>`;
    }
  }
}

function displaySelectedPriority(data) {
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
  let dataFromFireBase = await fetchCardDetails("contacts", idOfcurrentElement);
  for (const key in dataFromFireBase) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase, key)) {
      const profile = dataFromFireBase[key];
      const profileInitials = initials(profile.name);
      document.querySelector(".content").innerHTML += HTMLTamplateForDropdownProfiles(key, profile.color, profileInitials, profile.name);
    }
  }
  whichContactIsAssigned(idOfcurrentElement);
}

async function whichContactIsAssigned(id) {
  let dataFromFireBase = await fetchCardDetails("tasks", id);
  const allContactsInDropdownMenu = document.querySelectorAll(".align_items");
  for (let index = 0; index < allContactsInDropdownMenu.length; index++) {
    const contact = allContactsInDropdownMenu[index].getAttributeNode("id_value").value;
    const keyNames = Object.keys(dataFromFireBase[id].assigned);
    keyNames.forEach((element) => {
      if (contact === element) {
        allContactsInDropdownMenu[index].classList.add("selected_contact");
        allContactsInDropdownMenu[index].lastElementChild.lastElementChild.src = "./assets/icons/checkbox/check_white.svg";
        allContactsInDropdownMenu[index].addEventListener("click", function (event) {
          retractContactFromCard(event);
          allContactsInDropdownMenu[index].classList.remove("selected_contact");
          allContactsInDropdownMenu[index].lastElementChild.lastElementChild.src = "./assets/icons/checkbox/openCardRectangle.svg";
        });
      }
    });
  }
}

async function assignNewContacts(event) {
  const contact = event.currentTarget.getAttributeNode("id_value").value;
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  if (!(contact in dataFromFireBase[idOfcurrentElement].assigned || assignNewContList.includes(contact))) {
    assignNewContList.push(contact);
    let newContact = await getContacts(assignNewContList);
    addDataToFireBase(`${taskPath}/${idOfcurrentElement}/assigned`, newContact);
    let clicked_element = document.querySelector(`[id_value="${contact}"]`);
    clicked_element.classList.add("selected_contact");
    clicked_element.lastElementChild.lastElementChild.src = "./assets/icons/checkbox/check_white.svg";
    document.querySelector(".assigned_to").innerHTML = "";
    editFunction();
    addDataToFireBase(`${taskPath}/${idOfcurrentElement}/assigned`, newContact);
  }
}

async function retractContactFromCard(event) {
  const contact = event.currentTarget.getAttributeNode("id_value").value;
  let response = await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/assigned/${contact}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  document.querySelector(".assigned_to").innerHTML = "";
  editFunction();
}

async function displaySubtasksInTheEditMenu() {
  const dataFromFireBase = await fetchCardDetails(`${taskPath}/${idOfcurrentElement}/subtask`, idOfcurrentElement);
  for (const element in dataFromFireBase) {
    document.querySelector(".subtasks_box").innerHTML += HTMLTamplateForSubtasksInTheEditMenu(element, dataFromFireBase[element].task);
  }
}

async function editSubtask(event) {
  const refSubtaskID = event.currentTarget.getAttributeNode("id_subtask").value;
  const refTaskElement = event.currentTarget;
  const dataFromFireBase = await fetchCardDetails(`${taskPath}/${idOfcurrentElement}/subtask/${refSubtaskID}`, idOfcurrentElement);
  refTaskElement.innerHTML = HTMLTamplateForEditSubtask(refSubtaskID);
  const inputField = (document.getElementById(`editInputField${refSubtaskID}`).value = dataFromFireBase.task);
  document.querySelector(".subtask_box_items").classList.add("under_line");
  document.querySelector(".subtask_box_items").classList.remove("subtask_box_items");
  document.querySelector(`#editInputField${refSubtaskID}`).addEventListener("change", function (event) {
    saveNewSubtask(refSubtaskID, event.target.value);
  });
  document.querySelector(".confirm").addEventListener("click", function (event) {
    saveNewSubtask(refSubtaskID, event.target.value);
    document.querySelector(".subtasks_box").innerHTML = " ";
    displaySubtasksInTheEditMenu();
  });
}

async function saveNewSubtask(subtaskID, newValue) {
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/subtask/${subtaskID}.json`, {
    method: "PATCH",
    body: JSON.stringify({ task: newValue }),
    headers: { "Content-Type": "application/json" },
  });
}

async function deleteSubtask(event) {
  const refTrashButton = event.currentTarget;
  const refSubtaskID = refTrashButton.parentElement.parentElement.getAttributeNode("id_subtask").value;
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/subtask/${refSubtaskID}.json`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  reorderSubtasks();
  displayCardOnBoard();
}

async function reorderSubtasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${idOfcurrentElement}/subtask.json`);
    const subtasks = await response.json();
    if (!subtasks) {
      console.log("No subtasks found.");
      return;
    }
    console.log("Original subtasks:", subtasks);
    let subtaskArray = Array.isArray(subtasks) ? subtasks.filter((subtask) => subtask !== null) : Object.values(subtasks).filter((subtask) => subtask !== null);
    let reorderedSubtasks = subtaskArray.map((subtask, index) => ({ ...subtask }));

    console.log("Reordered subtasks:", reorderedSubtasks);
    const updateResponse = await fetch(`${BASE_URL}/tasks/${idOfcurrentElement}/subtask.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reorderedSubtasks),
    });
    if (!updateResponse.ok) throw new Error("Failed to update Firebase");
    console.log("Subtasks reordered successfully!");
  } catch (error) {
    console.error("Error reordering subtasks:", error);
  }
}

// async function addNewSubtask(event) {
//   let response = await fetch(`${BASE_URL}/tasks/${idOfcurrentElement}/subtask.json`, {
//     method: "GET",
//   });
//   let subtasks = await response.json();
//   let inputField = document.querySelector("#editSubtask");
//   let saveInput = inputField.value;
//   console.log(sub);
// }

function writeEditSubtask() {
  let subtask = document.getElementById("editSubtask").value;
  if (subtask.length < 1) {
    setStandardButton();
  }
  if (subtask.length >= 1) {
    setdubbleButton();
  }
}
