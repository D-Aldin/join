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
  document.getElementById("subtaskbuttons").innerHTML = getStandardButton();
}

function setdubbleButton() {
  document.getElementById("subtaskbuttons").innerHTML = getDubbleButton();
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
  for (const key in subtasksList) {
    if (Object.prototype.hasOwnProperty.call(subtasksList, key)) {
      const element = subtasksList[key];
      subtasksTemplate(tasks, key, element.task);
    }
  }
}

function subtasksTemplate(tasks, i, element) {
  tasks.innerHTML += getSubtaskTemplate(i, element);
}

function deleteSubtask(x) {
  delete subtasksList[x];
  renderSubtasks();
}

function editSubtask(x) {
  currentcontainer = document.getElementById(x);
  currentcontainer.classList.remove("subtask-list");
  currentcontainer.classList.add("subtask-list-by-edit");
  document.getElementById(x).innerHTML = getEditSubtask(x);
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
