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
    <div id="contact_${index}" class="contact_list hover_contact_list transition" onclick="toggleOverlayContactInfos(${index})">
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
    <div class="arrow_contact_info" onclick="closeContactInfoOverlay()">
      <img src="./assets/icons/help/arrow.svg" alt="arrow for go back" />
    </div>
    <div class="d_none responsive_contact_headline responsive_header_standard_size">
      <h1>Contacts</h1>
      <div class="line"></div>
      <h2>Better with a Team</h2>
      <div class="line_responsive"></div>
    </div>
    <div class="overlay_contact_info_header">
    <div class="circle_contact_img" style="background-color:${contact.color}">${initials}</div>
    <div>
      <h2>${contact.name}</h2>
      <div class="btn_position">
        <img onclick="openOverlayEditContact('${contact.id}')" class="edit_hover transition" src="./assets/icons/contacts/edit.svg" alt="edit" />
        <img onclick=" setTimeoutDeleteOverlayContact()" class="delete_hover transition" src="./assets/icons/contacts/delete.svg" alt="delete" />
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
    <p class="number_design"><a href="tel:${contact.phone}">${contact.phone}</a></p>
  </div>
  <button onclick="openEditOverlay()" class="d_none responsive_edit_contact"><img src="./assets/icons/contacts/more_vert.svg" alt="add_person" /></button>
  <div id="submenu_edit_position" class="d_none">
    <div class="d_none help_submenu_section_responsive" onclick="openOverlayEditContact('${contact.id}')">
      <img class="edit_hover transition" src="./assets/icons/contacts/edit.svg" alt="edit" />
    </div>
    <div class="submenu_section" onclick=" setTimeoutDeleteOverlayContact()">
      <img class="delete_hover transition" src="./assets/icons/contacts/delete.svg" alt="delete" />
    </div>
  </div>`;
}

// deleteContactFromList('${contact.id}');

function getTemplateOfContactEdit(contact) {
  const initials = getInitials(contact.name);
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
        <div class="circle_contact_img" style="background-color:${contact.color}">${initials}</div>
      </div>
      <div class="overlay_close_btn_position">
        <img onclick="closeOverlayEditContact()" src="./assets/icons/contacts/Close.svg" alt="close_button" />
      </div>
      <form action class="form_input_fields_position" onsubmit="updateContactInDataBase('${contact.id}'); setTimeoutSuccessfullyOverlayEdit(); return false;">
        <input id="edit_name" type="text" placeholder="Name" value="${contact.name}" required />
        <input id="edit_email" type="email" placeholder="Email" value="${contact.email}" required />
        <input id="edit_phone" type="number" placeholder="Phone" value="${contact.phone}" required />
        <div class="overlay_btn_position">
          <button type="button" class="btn_delete transition" onclick=" setTimeoutDeleteOverlayContact()">Delete <img src="./assets/icons/contacts/Close.svg" class="cancel_icon" alt="Cancel" /></button>
          <button type="submit" class="btn_save transition">Save <img src="./assets/icons/contacts/check.svg" alt="check" /></button>
        </div>
      </form>
    </div>`;
}

// deleteContactFromList('${contact.id}');
