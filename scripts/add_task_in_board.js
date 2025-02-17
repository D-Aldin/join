let contactList = [];
let storeThePrioValue;

const inputTitle = document.querySelector("#title");
const inputDescription = document.querySelector("#description");
const inputDate = document.querySelector("#date");
const inputCategory = document.querySelector("#category");

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
  console.log(id);
  profileContainer.innerHTML += contactTamplateForAddTaskSectionInBoard(name, color, id);
  collectDataForNewTask();
}

function unselect(id) {
  let refElement = document.getElementById(id);
  refElement.remove();
}

function buttonUrgent(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnUrgent.style.backgroundColor = "rgb(255, 61, 0)";
  btnUrgent.style.color = "white";
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
  btnMedium.style.backgroundColor = "rgb(255, 168, 0)";
  btnMedium.style.color = "white";
  document.querySelector("#iconmedium").firstChild.src = "./assets/icons/addTask/icon_clicket_medium.svg";
  if (btnUrgent.hasAttribute("style") || btnLow.hasAttribute("style")) {
    btnUrgent.removeAttribute("style");
    btnLow.removeAttribute("style");
    document.querySelector("#iconurgent").firstChild.src = "assets/icons/addTask/icon_urgent.svg";
    document.querySelector("#iconlow").firstChild.src = "assets/icons/addTask/icon_low.svg";
  }
}

function buttonLow(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnLow.style.backgroundColor = "rgb(122, 226, 41)";
  btnLow.style.color = "white";
  document.querySelector("#iconlow").firstChild.src = "./assets/icons/addTask/icon_clicket_low.svg";
  if (btnMedium.hasAttribute("style") || btnUrgent.hasAttribute("style")) {
    btnMedium.removeAttribute("style");
    btnUrgent.removeAttribute("style");
    document.querySelector("#iconmedium").firstChild.src = "assets/icons/addTask/icon_medium.svg";
    document.querySelector("#iconurgent").firstChild.src = "assets/icons/addTask/icon_urgent.svg";
  }
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
  document.querySelector("#tasks-wrapper").innerHTML += `<p class="subtask_paragraf">&bull; ${inputSubtask.value}</p>`;
  inputSubtask.value = "";
  closeInputField();
}

function addSubtask() {
  const inputSubtask = document.querySelector("#subtask");
}

// TODO
function collectDataForNewTask(params) {
  let saveID = 0;
  // let saveTitle = inputTitle.value;
  // let saveDescription = inputDescription.value;
  let saveContacts = [...document.querySelectorAll(".test")].map((el) => el.id);
  // let saveDate = inputDate.value;
  let savePrio = storeThePrioValue;
  // let saveCategory = inputCategory;
}

collectDataForNewTask();
