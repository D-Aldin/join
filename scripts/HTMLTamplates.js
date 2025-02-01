function renderCard(id, category, title, discription, subtasks, contact, prio) {
  return ` 
              <article id=${id} onclick="overlayOn(), getData(event)" ondragstart="draggedElementID(event)" class="card" draggable="true">
                <div class="category">${category}</div>
                <div class="card_title">
                  <h4 id="title">${title}</h4>
                </div>
                <div class="discription">
                  <h5 id="discription">${discription}</h5>
                </div>
                <div class="progress_indicator">
                  <div class="progress_container">
                    <div class="progress_bar" style="width: 20%"></div>
                  </div>
                  <span id="subtasks">${subtasks}</span>
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

function contactTamplate(contact, color) {
  return `
            <div class="circle" style="transform: translateX(0%); background-color: ${color}">${contact}</div>`;
}

// TODO add more param to the function
function HTMLForOpenCard(category, title, discription, date, prio) {
  return `     
                <div class="category_box">
                  <div class="open_card_category">${category}</div>
                  <button class="closeBtn"><img src="./assets/icons/board/close.svg" alt="close" /></button>
                </div>
                <div class="content_box">
                  <div class="open_card_title">${title}</div>
                  <div class="open_card_discription">${discription}</div>
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
                      <div>Assigned To:</div>
                      <div class="profiles">
                        <div class="profile_names">
                          <div class="circle">RR</div>
                          <span>Robby Runge</span>
                        </div>
                        <div class="profile_names">
                          <div class="circle">SB</div>
                          <span>Simon Burlet</span>
                        </div>
                        <div class="profile_names">
                          <div class="circle">AD</div>
                          <span>Aldin Dobric</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="open_card_subtasks">
                    <div>Subtasks</div>
                    <div class="">
                      <div>
                        <input id="subtasks" type="checkbox" />
                        <label for="subtasks">Implement JS function for openCard</label>
                      </div>
                      <div>
                        <input id="subtasks" type="checkbox" />
                        <label for="subtasks">Implement JS function for openCard</label>
                      </div>
                    </div>
                  </div>
                  <div class="delete_edit_btn_box">
                    <button class="deleteBtn"><img src="./assets/icons/board/delete.svg" alt="" /></button>
                    <button class="editBtn"><img src="./assets/icons/board/edit.svg" alt="" /></button>
                  </div>
                </div>`;
}

function getTemplateOfRenderContacts(contact, index) {
  return `    
    <div class="contacts_list_test">
      <div class="first_letter">${contact.name.charAt(0)}</div>
    </div>
    <div class="line_bottom"></div>
    <div id="contact_${index}" class="contact_list hover_contact_list" onclick="toggleOverlayContactInfos(${index})">
      <img class="contact_img" src="./assets/icons/contacts/am_account_icon.svg" />
      <div class="account_info">
        <p>${contact.name}</p>
        <span>${contact.email}</span>
      </div>
    </div>`;
}

function getTemplateOfContactInfo(contact) {
  return `
    <div class="overlay_contact_info_header">
    <img class="account_icon" src="./assets/icons/contacts/am_account_icon.svg" alt="account_icon" />
    <div>
      <h2>${contact.name}</h2>
      <div class="btn_position">
        <img onclick="openOverlayEditContact()" class="edit_hover" src="./assets/icons/contacts/edit.svg" alt="edit" />
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
