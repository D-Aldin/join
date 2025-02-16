let contactList = [];

let profileContainer = document.querySelector(".chosen_contacts");
const inputTitle = document.querySelector("#title");
const inputDescription = document.querySelector("#description");
const inputDate = document.querySelector("#date");

function showOverlay(event) {
  document.querySelector("#overlayForAddTask").style.display = "block";
}

function hideOverlay() {
  document.querySelector("#overlayForAddTask").style.display = "none";
}

function renderAddTaskMenu() {}

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
// TODO
function collectDataForNewTask(params) {
  let saveID = 0;
  let saveTitle = inputTitle.value;
  let saveDescription = inputDescription.value;
  let saveContacts = [...document.querySelectorAll(".test")].map((el) => el.id);
  let saveDate = inputDate.value;
  let savePrio;
}

collectDataForNewTask();
