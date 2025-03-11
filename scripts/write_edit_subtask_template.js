function getStandardButton() {
  return `              
    <button type="button" class="subtask-inputfield-button">
      <img src="assets/icons/addTask/subtasks_icons.svg" alt="">
    </button>`;
}

function getDubbleButton() {
  return `
    <button type="button" class="subtask-inputfield-button">
      <img onclick="clearsubtask()" src="assets/icons/addTask/cross.svg" alt="">
    </button>
    <div class="pixelbar-mini"></div>
    <button type="button" class="subtask-inputfield-button">    
      <img onclick="setSubtask()" src="assets/icons/addTask/done.svg" alt="">
    </button>`;
}

function getSubtaskTemplate(i, element) {
  return `
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

function getEditSubtask(x) {
  return `
    <input class="subtask-edit-inputfield" id="current-subtask${x}" type="text">
    <div class="subtask-list-button-container-by-edit">
      <button type="button" onclick="setEditSubtask(${x})" style="background-color: white" class="subtask-list-button"><img src="assets/icons/addTask/done.svg" alt=""></button>
      <div class="pixelbar-subtask"></div>
      <button type="button" onclick="deleteSubtask('${x}')" style="background-color: white" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
    </div>`;
}
