let contactList = [];
let storeThePrioValue = " ";
let subtaskObject = {};
let statusOfRequired = false;
let taskStatus = "toDo";

function showOverlay(event) {
  document.querySelector("#overlayForAddTask").style.display = "block";
}

function hideOverlay() {
  document.querySelector("#overlayForAddTask").style.display = "none";
}

function renderAddTaskMenu() {
  document.querySelector("#add_task_box").innerHTML = HTMLTamplateForAddTaskInBorad();
}

async function displayDropDownMenuSectionAddTask() {
  let dataFromFireBase = await fetchTasks("contacts");
  for (const key in dataFromFireBase) {
    if (Object.prototype.hasOwnProperty.call(dataFromFireBase, key)) {
      const profile = dataFromFireBase[key];
      const profileInitials = initials(profile.name);
      document.querySelector(".contentSectionAddTask").innerHTML += HTMLTamplateForDropdownProfilesSectionAddTask(key, profile.color, profileInitials, profile.name);
    }
  }
}

function chooseContact(event) {
  const profile = event.currentTarget;
  const contactID = profile.getAttributeNode("id_value").value;
  const checkbox = profile.lastElementChild.lastElementChild;
  if (profile.classList.toggle("selected_contact")) {
    checkbox.src = "./assets/icons/checkbox/check_white.svg";
    displayChossenContact(contactID);
  } else {
    checkbox.src = "./assets/icons/checkbox/openCardRectangle.svg";
    unselect(contactID);
  }
}

async function displayChossenContact(id) {
  let profileContainer = document.querySelector(".chosen_contacts");
  let dataFromFireBase = await fetchTasks(`contacts/${id}`);
  let name = initials(dataFromFireBase.name);
  let color = dataFromFireBase.color;
  profileContainer.innerHTML += contactTamplateForAddTaskSectionInBoard(name, color, id);
  collectDataForNewTask();
}

function unselect(id) {
  let refElement = document.querySelector(`[profile_id=${id}]`);
  refElement.remove();
}

function buttonUrgent(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnUrgent.style = "background-color:rgb(255, 61, 0); color: white";
  document.querySelector("#iconurgent").firstChild.src = "./assets/icons/addTask/icon_clicket_urgent.svg";
  if (btnMedium.hasAttribute("style") || btnLow.hasAttribute("style")) {
    btnMedium.removeAttribute("style");
    btnLow.removeAttribute("style");
    document.querySelector("#iconmedium").firstChild.src = "assets/icons/addTask/icon_medium.svg";
    document.querySelector("#iconlow").firstChild.src = "assets/icons/addTask/icon_low.svg";
  }
}

function buttonMedium(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnMedium.style = "background-color:rgb(255, 168, 0); color: white";
  document.querySelector("#iconmedium").firstChild.src = "./assets/icons/addTask/icon_clicket_medium.svg";
  if (btnUrgent.hasAttribute("style") || btnLow.hasAttribute("style")) {
    btnUrgent.removeAttribute("style");
    btnLow.removeAttribute("style");
    document.querySelector("#iconurgent").firstChild.src = "assets/icons/addTask/icon_urgent.svg";
    document.querySelector("#iconlow").firstChild.src = "assets/icons/addTask/icon_low.svg";
  }
  storeThePrioValue = "medium";
}

function buttonLow(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnLow.style = "background-color: rgb(122, 226, 41); color: white";
  document.querySelector("#iconlow").firstChild.src = "./assets/icons/addTask/icon_clicket_low.svg";
  if (btnMedium.hasAttribute("style") || btnUrgent.hasAttribute("style")) {
    btnMedium.removeAttribute("style");
    btnUrgent.removeAttribute("style");
    document.querySelector("#iconmedium").firstChild.src = "assets/icons/addTask/icon_medium.svg";
    document.querySelector("#iconurgent").firstChild.src = "assets/icons/addTask/icon_urgent.svg";
  }
  storeThePrioValue = "low";
}

function focusTheField() {
  const inputSubtask = document.querySelector("#subtask");
  inputSubtask.focus();
  document.querySelector(".subtask-inputfield-button").classList.toggle("hide_element");
  document.querySelector(".inputFiledSubtask").classList.toggle("hide_element");
  inputSubtask.value = "";
}

function closeInputField() {
  const inputSubtask = document.querySelector("#subtask");
  document.querySelector(".subtask-inputfield-button").classList.toggle("hide_element");
  document.querySelector(".inputFiledSubtask").classList.toggle("hide_element");
  inputSubtask.value = "";
}

function newSubtask() {
  const inputSubtask = document.querySelector("#subtask");
  document.querySelector("#tasks-wrapper").innerHTML += HTMLTamplateForSubtasksInAddTaskBoard(inputSubtask.value);
  inputSubtask.value = "";
  closeInputField();
}

function deleteSubtaskBoardSection(event) {
  let task = event.currentTarget.parentElement.parentElement;
  task.remove();
}

function editSubtaskInAddTaskAreaBoard(event) {
  task = event.currentTarget.parentElement.parentElement;
  document.getElementById(task.id).style.backgroundColor = "white";
  task.innerHTML = testTamplate();
  let inputField = document.querySelector(".edit_subtask_input_field input");
  inputField.value = task.id;
}

function confirmEditing(event) {
  let task = event.currentTarget.parentElement.parentElement.parentElement;
  let inputField = document.querySelector(".edit_subtask_input_field input");
  task.remove();
  document.querySelector("#tasks-wrapper").innerHTML += HTMLTamplateForSubtasksInAddTaskBoard(inputField.value);
}

// TODO
async function collectDataForNewTask(status) {
  const inputTitle = document.querySelector("#title");
  const inputDescription = document.querySelector("#description");
  const inputDate = document.querySelector("#date");
  const inputCategory = document.querySelector("#category");
  let id = `task_${Date.now()}`;
  collectTheContacts();
  collectTheSubtasks();
  let contacts = await getContactsFromFireBase(contactList);
  return {
    [id]: {
      id: id,
      title: inputTitle.value,
      description: inputDescription.value || " ",
      assigned: contacts,
      date: inputDate.value,
      prio: storeThePrioValue || " ",
      category: inputCategory.value,
      subtask: subtaskObject || [],
      status: taskStatus,
      user: localStorage.userId,
    },
  };
}

function collectTheContacts() {
  let refAllChosenContacts = document.querySelectorAll("#profile");
  refAllChosenContacts.forEach((element) => {
    let contact = element.getAttribute("profile_id");
    if (!contactList.includes(contact)) {
      contactList.push(contact);
    }
  });
}

function collectTheSubtasks() {
  let refAllChosenSubtasks = document.querySelectorAll(".subtask_paragraf");
  for (let index = 0; index < refAllChosenSubtasks.length; index++) {
    const task = refAllChosenSubtasks[index].innerHTML.substring(1);
    subtaskObject[`subtask_${Date.now()}`] = { task: task, state: false };
  }
}

function requiredFieldTitle() {
  const inputFiledTitle = document.querySelector("#title");
  if (inputFiledTitle.value.length === 0) {
    inputFiledTitle.classList.add("required_color");
    document.querySelector("#titleRequired").classList.remove("hide_element");
  }
  inputFiledTitle.addEventListener("input", function () {
    this.classList.remove("required_color");
    document.querySelector("#titleRequired").classList.add("hide_element");
  });
}

function requiredFieldDate() {
  const inputFiledDate = document.getElementById("date");
  if (!inputFiledDate.value || inputFiledDate.value === "") {
    inputFiledDate.classList.add("required_color");
    document.querySelector("#dateRequired").classList.remove("hide_element");
  }
  inputFiledDate.addEventListener("change", function () {
    this.classList.remove("required_color");
    document.querySelector("#dateRequired").classList.add("hide_element");
  });
  inputFiledDate.addEventListener("input", function () {
    this.classList.remove("required_color");
    document.querySelector("#dateRequired").classList.add("hide_element");
  });
}

function requiredFieldCategory() {
  const inputFiledCategory = document.querySelector("#category");
  if (inputFiledCategory.value === "placeholder") {
    inputFiledCategory.classList.add("required_color");
    document.querySelector("#categoryRequired").classList.remove("hide_element");
  }
  inputFiledCategory.addEventListener("input", function () {
    this.classList.remove("required_color");
    document.querySelector("#categoryRequired").classList.add("hide_element");
  });
}

function mimicPlaceHolder() {
  let placeholder = document.querySelector('option[value="placeholder"]');
  if (!placeholder) {
    return;
  }
  placeholder.remove();
}

async function createTask() {
  requiredFieldTitle();
  requiredFieldDate();
  requiredFieldCategory();
  const inputFiledTitle = document.querySelector("#title");
  const inputFiledDate = document.getElementById("date");
  const inputFiledCategory = document.querySelector("#category");
  if (inputFiledTitle.value.length === 0 || !inputFiledDate.value || inputFiledDate.value === 0 || inputFiledCategory.value === "placeholder") {
    return 0;
  } else {
    document.querySelector(".task_added").classList.remove("hide_element");
    let card = await collectDataForNewTask();
    addDataToFireBase("tasks", card);
    setTimeout(hideOverlay, 1000);
  }
}

document.querySelector("#addToDo").addEventListener("click", function () {
  showOverlay();
  renderAddTaskMenu();
});

document.querySelector("#addProgress").addEventListener("click", function () {
  showOverlay();
  renderAddTaskMenu();
  taskStatus = "progress";
});

document.querySelector("#addFeedback").addEventListener("click", function () {
  showOverlay();
  renderAddTaskMenu();
  taskStatus = "feedback";
});
