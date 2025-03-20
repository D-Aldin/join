function renderContactTemplate(contactlist, currentContact, i) {
  contactlist.innerHTML += `<div id="contact${i}" class="contactlist" onclick="addContact(${i}); event.stopPropagation();">
    <div class="flex_gap_16">
        <div class="contact-img-cyrcle" style="background-color: ${currentContact.color}">${returnFirstLetter(currentContact.name)}</div>
        ${currentContact.name}
    </div>
    <div id="contact-checkbox${i}" onclick="addContact(${i}); event.stopPropagation();">
        <img src="assets/icons/addTask/box.svg" alt="">
    </div>
</div>`;
}
