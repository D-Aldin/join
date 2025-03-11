function renderContactTemplate(contactlist, currentContact, i) {
    contactlist.innerHTML += /*html*/ `
              <div onclick="addContact(${i})" id="contact${i}" class="contactlist">
                  <div class="flex_gap_16">
                      <div class="contact-img-cyrcle" style="background-color: ${currentContact.color}">${returnFirstLetter(currentContact.name)}</div>
                      ${currentContact.name}
                  </div>
                  <div id="contact-checkbox${i}">
                      <img src="assets/icons/addTask/box.svg" alt="">
                  </div>
              </div>
          `;
  }