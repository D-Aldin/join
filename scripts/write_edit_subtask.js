const subtaskInputField = document.querySelector("#subtask");

function writeSubtask() {
  let subtask = document.getElementById("subtask").value;
  document.getElementById("subtusk-input-border").classList.add("subtask-inputfield-focus");
  if (subtask.length < 1) {
    setStandardButton();
  }
  if (subtask.length >= 1) {
    setdubbleButton();
  }
}

function setStandardButton() {
  document.getElementById("subtaskbuttons").innerHTML = /*html*/ `
              <button type="button" class="subtask-inputfield-button">
                  <img src="assets/icons/addTask/subtasks_icons.svg" alt="">
              </button>
          `;
}

function setdubbleButton() {
  document.getElementById("subtaskbuttons").innerHTML = /*html*/ `
              <button type="button" class="subtask-inputfield-button">
                  <img onclick="clearsubtask()" src="assets/icons/addTask/cross.svg" alt="">
              </button>
              <div class="pixelbar-mini"></div>
              <button type="button" class="subtask-inputfield-button">    
                  <img onclick="setSubtask()" src="assets/icons/addTask/done.svg" alt="">
              </button>`;
}

function clearsubtask() {
  document.getElementById("subtask").value = "";
  setStandardButton();
}

function setSubtask() {
  let subtask = document.getElementById("subtask").value;
  let newSubtaskKey = `subtask_${Date.now()}`;
  let newSubtask = {
    state: false,
    task: subtask,
  };
  subtasksList[newSubtaskKey] = newSubtask;
  renderSubtasks();
  clearsubtask();
}

function renderSubtasks() {
  let tasks = document.querySelector("#tasks-wrapper");
  tasks.innerHTML = "";
  if (subtasksTemplate.length == []) {
    
  }
  for (const key in subtasksList) {
    if (Object.prototype.hasOwnProperty.call(subtasksList, key)) {
      const element = subtasksList[key];
      subtasksTemplate(tasks, key, element.task);
    }
  }
}

function subtasksTemplate(tasks, i, element) {
  tasks.innerHTML += /*html*/ `
          <div id="${i}" class="subtask-list" >
              <ul class="full_with" onclick="editSubtask('${i}')">
                  <li>${element}</li>   
              </ul>
              <div class="subtask-list-button-container">
                  <button type="button" onclick="editSubtask('${i}')" class="subtask-list-button"><img src="assets/icons/addTask/pen.svg" alt=""></button>
                  <div class="pixelbar-subtask"></div>
                  <button type="button" onclick="deleteSubtask('${i}')" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
              </div>
          </div>`;
}

function deleteSubtask(x) {
  delete subtasksList[x];
  renderSubtasks();
}

function editSubtask(x) {
  currentcontainer = document.getElementById(x);
  currentcontainer.classList.remove("subtask-list");
  currentcontainer.classList.add("subtask-list-by-edit");

  document.getElementById(x).innerHTML = /*html*/ `
          <input class="subtask-edit-inputfield" id="current-subtask${x}" type="text">
          <div class="subtask-list-button-container-by-edit">
                  <button type="button" onclick="setEditSubtask(${x})" class="subtask-list-button"><img src="assets/icons/addTask/done.svg" alt=""></button>
                  <div class="pixelbar-subtask"></div>
                  <button type="button" onclick="deleteSubtask('${x}')" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
          </div>`;
  currentsubtask = document.getElementById("current-subtask" + x);
  currentsubtask.value = subtasksList[x].task;
}

function setEditSubtask(x) {
  let newText = document.querySelector(`#${x.id}`).firstElementChild.value;
  subtasksList[x.id].task = newText;
  renderSubtasks();
}

subtaskInputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    setSubtask();
  }
});
