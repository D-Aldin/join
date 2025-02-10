function renderCard(id, category, title, discription, completedSubtasks, subtasks, prio) {
  return ` 
              <article id=${id} onclick="overlayOn(event), getData(event)" ondragstart="draggedElementID(event)" class="card" draggable="true">
                <div class="category">${category}</div>
                <div class="card_title">
                  <h4 id="title">${title}</h4>
                </div>
                <div class="discription">
                  <h5 id="discription">${discription}</h5>
                </div>
                <div class="progress_indicator">
                  <div class="progress_container">
                    <div id="progress_bar${id}" class="progress_bar" style="width: 0%"></div>
                  </div>
                  <span id="subtasks${id}">${completedSubtasks}/${subtasks} Subtasks</span>
                </div>
                <div class="profile_prio_container">
                  <div class="profile">
                    
                  </div>
                  <div class="prio">
                    <img src="./assets/icons/board/${prio}.svg" alt="" />
                  </div>
                </div>
              </article>
      `;
}

function contactTamplate(contact, color, translateX) {
  return `
            <div class="circle" style="transform: translateX(-${translateX}%); background-color: ${color}">${contact}</div>`;
}

function contactTamplateForOpenCard(contact, color, fullName) {
  return `
          <div class="profile_names">
            <div class="circle circle_profile_names" style="background-color: ${color}">${contact}</div>
            <span>${fullName}</span>
          </div>  `;
}

function subtasksTamplate(task, id, state) {
  return `
          <div class="check_box">
            <input type="checkbox" id="subtask${id}" name="subtask${id}" value="task${id}"/>
            <label for="subtask${id}">${task}</label>
          </div>`;
}

// TODO add more param to the function
function HTMLForOpenCard(category, title, discription, date, prio, id) {
  return `     
                <div class="category_box">
                  <div class="open_card_category">${category}</div>
                  <button class="closeBtn"><img onclick="overlayOff()" src="./assets/icons/board/close.svg" alt="close" /></button>
                </div>
                <div class="content_box">
                  <h1 class="open_card_title">${title}</h1>
                  <p class="open_card_discription">${discription}</p>
                  <div class="open_card_date">
                    <table>
                      <tr>
                        <td>Duo date:</td>
                        <td id="date">${date}</td>
                      </tr>
                      <tr class="space"></tr>
                      <tr>
                        <td>Priority:</td>
                        <td id="priority">${prio}<img src="./assets/icons/board/${prio}.svg" alt="${prio}" /></td>
                      </tr>
                    </table>
                  </div>
                  <div class="open_card_assigned">
                    <div class="assigned_box">
                      <h5>Assigned To:</h5>
                      <div class="profiles"></div>
                    </div>
                  </div>
                  <div class="open_card_subtasks">
                    <h5>Subtasks</h5>
                    <form id="subtasks_container">
                      
                    </form>
                  </div>  
                  </div>
                  <div class="edit_button_box">
                    <div onclick="deleteButton()" class="position_delete">
                      <div class="trash_img"></div>
                      <button class="delete_button">Delete</button>
                    </div>
                    <div class="vector"></div>
                    <div class="position_edit">
                      <div class="edit_img"></div>
                      <button onclick="renderEditMenu(), editFunction()" class="edit_button">Edit</button>
                    </div>
                </div>`;
}

function HTMLTamplateForTheEditFunk() {
  return `
            <div class="scrollbar">
              <div class=close_button>
                <button  class="closeBtn"><img onclick="overlayOff()" src="./assets/icons/board/close.svg" alt="close"></button>
              </div>
              <div class="content_height">
                <form class="title_description_date" action="">
                  <label for="editTitle">Title</label>
                  <input type="text" id="editTitle" name="title" class="inputfield dimensions" /><br>
                  <label for="editDescription">Description</label>
                  <textarea name="description" id="editDescription"></textarea><br /> 
                  <label for="editDate">Due date</label>
                  <input data-date-format="dd mm yy" name="date" id="editDate" type="date" class="inputfield dimensions"/>
                </form>
                <h3>Priority</h3>
                <div class="button_container">
                  <button id="urgent" class="prio_button">Urgent <img id="urgentImageEditBtn" src="./assets/icons/board/forEditUrgent.svg" alt="urgent"></button>
                  <button id="medium" class="prio_button">Medium <img id="mediumImageEditBtn" src="./assets/icons/board/forEditMedium.svg" alt="medium"></button>
                  <button id="low" class="prio_button">Low <img id="lowImageEditBtn" src="./assets/icons/board/forEditLow.svg" alt="low"></button>
                </div>
                <div>
                  <div class="dropdown_menu">
                    <div class="dropdown_button" onclick="openMenu()">Select contacts to assign
                    <img id="arrow" src="./assets/icons/board/arrow_drop_down.svg" alt="arrow" /></div>
                    <div class="content"></div>
                  </div>  
                    <div class="assigned_to">
                    </div>
                  <h3>Subtasks</h3>
                  <div class="subtask_input">
                    <input id="editSubtask" class="subtask-inputfield-text" oninput="writeEditSubtask()" type="text">
                    <div id="subtaskbuttons" class="subtask-button-container">
                      <button class="subtask-inputfield-button">
                        <img src="assets/icons/addTask/subtasks_icons.svg" alt="">
                      </button>
                    </div>
                  </div><br>
                  <div class="subtasks_box">

                  </div>
                  <input type="submit" value="Submit" />
                  </form>
                </div>;
              </div>`;
}

function HTMLTamplateForDropdownProfiles(key, color, initials, name) {
  return `<div onclick="assignNewContacts(event)" class="align_items" id_value=${key}>
            <div class="icon_name_container">
            <div class="circle circle_profile_names spacing" style="background-color: ${color}">${initials}</div>${name}</div>
            <div>
              <img src="./assets/icons/checkbox/openCardRectangle.svg" alt="" srcset="">
            </div>
          </div>`;
}

function setStandardButton() {
  document.getElementById("subtaskbuttons").innerHTML = /*html*/ `
          <button class="subtask-inputfield-button">
              <img src="assets/icons/addTask/subtasks_icons.svg" alt="">
          </button>
      `;
}

function setdubbleButton() {
  document.getElementById("subtaskbuttons").innerHTML = /*html*/ `
          <button class="subtask-inputfield-button">
              <img onclick="clearsubtask()" src="assets/icons/addTask/cross.svg" alt="">
          </button>
          <div class="pixelbar-mini"></div>
          <button class="subtask-inputfield-button">    
              <img onclick="setSubtask()" src="assets/icons/addTask/done.svg" alt="">
          </button>
      `;
}
