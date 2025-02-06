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
            <div>
              <div class=close_button>
                <button  class="closeBtn"><img onclick="overlayOff()" src="./assets/icons/board/close.svg" alt="close"></button>
              </div>
              <div>
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
                <form action="">
                  <label for="editAssigned">Assigned to</label><br>
                  <select name="assigned" id="editAssigned">
                    <option value="volvo">Volvo</option>
                    <option value="bmw">bmw</option>
                    <option value="mercedes">mercedes</option>
                  </select><br/><br />
                  <div class="assigned_to">
                  </div>
                  <input type="submit" value="Submit" />
                </form>
              </div>`;
}

function getLetterTemplate(letter) {
  return `
    <div class="contacts_list_first_letter">
      <div class="first_letter">${letter}</div>
    </div>
    <div class="line_bottom"></div>
  `;
}

function getContactTemplate(contact, index) {
  return `
    <div id="contact_${index}" class="contact_list hover_contact_list" onclick="toggleOverlayContactInfos(${index})">
      <div class="circle" id="circle_${index}"></div>
      <div class="account_info">
        <p>${contact.name}</p>
        <span>${contact.email}</span>
      </div>
    </div>
  `;
}

function getTemplateOfRenderContacts(contact, index) {
  return `    
    <div id="contact_${index}" class="contact_list hover_contact_list" onclick="toggleOverlayContactInfos(${index})">
      <div class="circle" id="circle_${index}"></div>
      <div class="account_info">
        <p>${contact.name}</p>
        <span>${contact.email}</span>
      </div>
    </div>`;
}

function getTemplateOfContactInfo(contact) {
  const initials = getInitials(contact.name);
  return `
    <div class="overlay_contact_info_header">
    <div class="circle_contact_img" style="background-color:${contact.color}">${initials}</div>
    <div>
      <h2>${contact.name}</h2>
      <div class="btn_position">
        <img onclick="openOverlayEditContact('${contact.id}')" class="edit_hover" src="./assets/icons/contacts/edit.svg" alt="edit" />
        <img onclick="deleteContactFromList('${contact.id}')" class="delete_hover" src="./assets/icons/contacts/delete.svg" alt="delete" />
      </div>
    </div>
  </div>
  <div class="headline_contact_info">
    <p>Contact Information</p>
  </div>
  <div class="contact_info">
    <span>Email</span>
    <p class="email_design">${contact.email}</p>
    <span>Phone</span>
    <p class="number_design">${contact.phone}</p>
  </div>`;
}

function getTemplateOfContactEdit(contact) {
  return `
    <div class="overlay_add_contact_left_side">
      <div class="overlay_logo_position">
        <img src="./assets/icons/logo/logo_white.svg" alt="logo" />
      </div>
      <div class="overlay_headline_add_contact">
        <h1>Edit contact</h1>
        <div class="line_contact"></div>
      </div>
    </div>
    <div class="overlay_add_contact_right_side">
      <div class="overlay_account_icon_position">
        <img src="./assets/icons/contacts/account_icon.svg" alt="account_icon" />
      </div>
      <div class="overlay_close_btn_position">
        <img onclick="closeOverlayEditContact()" src="./assets/icons/contacts/Close.svg" alt="close_button" />
      </div>
      <form action class="form_input_fields_position">
        <input id="edit_name" type="text" placeholder="Name" value="${contact.name}" required />
        <input id="edit_email" type="email" placeholder="Email" value="${contact.email}" required />
        <input id="edit_phone" type="tel" placeholder="Phone" value="${contact.phone}" required />
        <div class="overlay_btn_position">
          <button class="btn_delete" onclick="deleteContactFromList('${contact.id}')">Delete <img src="./assets/icons/contacts/Close.svg" class="cancel_icon" alt="Cancel" /></button>
          <button class="btn_save" onclick="updateContactInDataBase('${contact.id}')">Save <img src="./assets/icons/contacts/check.svg" alt="check" /></button>
        </div>
      </form>
    </div>`;
}
