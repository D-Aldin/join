const refUrgentBtn = document.getElementById("urgent");
const refMediumBtn = document.getElementById("medium");
const refLowBtn = document.getElementById("low");
const title = document.querySelector(".open_card_title");

function renderEditMenu() {
  refCardBox.innerHTML = "";
  refCardBox.innerHTML += HTMLTamplateForTheEditFunk();
  displaySubtasksInTheEditMenu();
  changeTitleAndDescription();
  changeDate();
  displayValuesInTheInputFields();
}

function displayValuesInTheInputFields() {
  document.querySelector("#editTitle").value = titleValue;
  document.querySelector("#editDescription").value = descriptionValue;
  document.querySelector("#editDate").value = dateValue;
}

async function saveDataToFire(section, newValue) {
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}.json`, {
    method: "PATCH",
    body: JSON.stringify({ [section]: newValue }),
    headers: { "Content-Type": "application/json" },
  });
}

async function editFunction() {
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
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

async function changeTitleAndDescription() {
  let refTitle = document.querySelector("#editTitle");
  let refDescriptionField = document.querySelector("#editDescription");
  refTitle.addEventListener("change", function () {
    saveDataToFire("title", refTitle.value);
  });
  refDescriptionField.addEventListener("change", function () {
    saveDataToFire("description", refDescriptionField.value);
  });
}

async function changeDate() {
  let taskDate = document.querySelector("#editDate");
  taskDate.addEventListener("change", function () {
    saveDataToFire("date", taskDate.value);
  });
}

// TODO reduce lines of code
function displaySelectedPriority(data) {
  let urgent = document.getElementById("urgent");
  let medinu = document.getElementById("medium");
  let low = document.getElementById("low");
  switch (data) {
    case "urgent":
      {
        urgent.style.backgroundColor = "rgb(255, 61, 0)";
        urgent.style.color = "white";
        document.getElementById("urgentImageEditBtn").src = "./assets/icons/addTask/icon_clicket_urgent.svg";
        urgent.classList.add("no_hover");
      }
      break;
    case "medium":
      {
        medinu.style.backgroundColor = "rgb(255, 168, 0)";
        medinu.style.color = "white";
        document.getElementById("mediumImageEditBtn").src = "./assets/icons/addTask/icon_clicket_medium.svg";
        medinu.classList.add("no_hover");
      }
      break;
    case "low": {
      low.style.backgroundColor = "rgb(122, 226, 41)";
      low.style.color = "white";
      document.getElementById("lowImageEditBtn").src = "./assets/icons/addTask/icon_clicket_low.svg";
      low.classList.add("no_hover");
    }
  }
}

async function urgent(event) {
  saveDataToFire("prio", "urgent");
  document.querySelector(".assigned_to").innerHTML = " ";
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  renderEditMenu();
  editFunction();
}

async function medium(event) {
  saveDataToFire("prio", "medium");
  document.querySelector(".assigned_to").innerHTML = " ";
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  renderEditMenu();
  editFunction();
}

async function low(event) {
  saveDataToFire("prio", "low");
  document.querySelector(".assigned_to").innerHTML = " ";
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  displaySelectedPriority(dataFromFireBase[idOfcurrentElement].prio);
  renderEditMenu();
  editFunction();
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

// TODO reduce lines of code
async function whichContactIsAssigned(id) {
  let dataFromFireBase = await fetchCardDetails("tasks", id);
  if (!dataFromFireBase[id].assigned) {
    dataFromFireBase[id].assigned = {};
  }
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

// TODO reduce lines of code
async function assignNewContacts(event) {
  const contact = event.currentTarget.getAttributeNode("id_value").value;
  let dataFromFireBase = await fetchCardDetails(taskPath, idOfcurrentElement);
  if (!dataFromFireBase[idOfcurrentElement].assigned) {
    dataFromFireBase[idOfcurrentElement].assigned = {};
  }
  if (!(contact in dataFromFireBase[idOfcurrentElement].assigned || assignNewContList.includes(contact))) {
    assignNewContList.push(contact);
    let newContact = await getContactsFromFireBase(assignNewContList);
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

async function editSubtaskFunk(event) {
  const refSubtaskID = event.currentTarget.getAttributeNode("id_subtask").value;
  const refTaskElement = event.currentTarget;
  const dataFromFireBase = await fetchCardDetails(`${taskPath}/${idOfcurrentElement}/subtask/${refSubtaskID}`, idOfcurrentElement);
  refTaskElement.innerHTML = HTMLTamplateForEditSubtask(refSubtaskID);
  setupSubtaskEditing(refSubtaskID, dataFromFireBase);
}

function setupSubtaskEditing(refSubtaskID, dataFromFireBase) {
  let inputField = document.getElementById(`${refSubtaskID}`);
  if (!inputField) return;
  inputField.value = dataFromFireBase.task;
  document.querySelector(`div[id_subtask="${refSubtaskID}"]`).classList.add("under_line");
  document.querySelector(`div[id_subtask="${refSubtaskID}"]`).classList.remove("subtask_box_items");
  document.querySelector(`input[id="${refSubtaskID}"]`).addEventListener("change", (event) => {
    saveNewSubtask(refSubtaskID, event.target.value);
  });
  document.querySelector(".confirm").addEventListener("click", (event) => {
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
  const refTrashButton = event.currentTarget.getAttribute("id_trash");
  console.log(refTrashButton);
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/subtask/${refTrashButton}.json`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  document.querySelector(".subtasks_box").innerHTML = " ";
  displaySubtasksInTheEditMenu();
}

// TODO reduce lines of code
async function addNewSubtask(event) {
  let newTaskObj;
  let response = await fetch(`${BASE_URL}/tasks/${idOfcurrentElement}/subtask.json`, {
    method: "GET",
  });
  let subtasks = await response.json();
  if (subtasks === null) {
    setIndex = 0;
  } else {
    setIndex = subtasks.length;
  }
  let theNewTask = document.querySelector("#editSubtask").value;
  newTaskObj = {
    [`subtask_${Date.now()}`]: {
      task: theNewTask,
      state: false,
    },
  };
  await fetch(`${BASE_URL}/${taskPath}/${idOfcurrentElement}/subtask.json`, {
    method: "PATCH",
    body: JSON.stringify(newTaskObj),
    headers: { "Content-Type": "application/json" },
  });
  document.querySelector("#editSubtask").value = "";
  setStandardButtonInOpenCard();
  document.querySelector(".subtasks_box").innerHTML = " ";
  displaySubtasksInTheEditMenu();
}

function focusOnInputField(event) {
  const newTaskInputField = document.querySelector("#editSubtask").focus();
}

async function okBtnFunk() {
  let id = idOfcurrentElement;
  const fetchDetails = await fetchCardDetails(taskPath, id);
  const refersToCard = fetchDetails[id];
  refCardBox.innerHTML = HTMLForOpenCard(refersToCard.category, refersToCard.title, refersToCard.description, refersToCard.date, refersToCard.prio, id);
  managenProfilesWhenCardOpen(id);
  renderSubtasks(id);
}

function writeEditSubtask() {
  let subtask = document.getElementById("editSubtask").value;
  if (subtask.length < 1) {
    setStandardButtonInOpenCard();
  }
  if (subtask.length >= 1) {
    setdubbleButtonInOpenCard();
  }
}

function clearEditSubtask(event) {
  document.getElementById("editSubtask").value = "";
  setStandardButtonInOpenCard();
}
