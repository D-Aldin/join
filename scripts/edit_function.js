const refUrgentBtn = document.getElementById("urgent");
const refMediumBtn = document.getElementById("medium");
const refLowBtn = document.getElementById("low");

function renderEditMenu() {
  refCardBox.innerHTML = "";
  refCardBox.innerHTML += HTMLTamplateForTheEditFunk();
  displaySubtasksInTheEditMenu();
  changeTitleAndDescription();
  //   okBtnFunk();
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

async function editSubtaskFunk(event) {
  const refSubtaskID = event.currentTarget.getAttributeNode("id_subtask").value;
  const refTaskElement = event.currentTarget;
  const dataFromFireBase = await fetchCardDetails(`${taskPath}/${idOfcurrentElement}/subtask/${refSubtaskID}`, idOfcurrentElement);
  refTaskElement.innerHTML = HTMLTamplateForEditSubtask(refSubtaskID);
  document.getElementById(`editInputField${refSubtaskID}`).value = dataFromFireBase.task;
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
  document.querySelector(".subtasks_box").innerHTML = " ";
  reorderSubtasks();
  displaySubtasksInTheEditMenu();
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

async function addNewSubtask(event) {
  let setIndex;
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
    [setIndex]: {
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
  refCardBox.innerHTML = HTMLForOpenCard(refersToCard.category, refersToCard.title, refersToCard.description, refersToCard.data, refersToCard.prio, id);
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
