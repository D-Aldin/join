function closeOverlayContactInfoAfterDelete() {
  let overlay = document.getElementById("overlay_contact_infos");
  overlay.style.animation = "slideOutToRightContactInfos 0.3s forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
    },
    { once: true }
  );
}

function openOverlayAddContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_add_contact_card");
  overlayRef.classList.add("overlay_background");
  overlayCardRef.classList.add("overlay_add_contact_card");
  overlayCardRef.style.animation = "slideInFromRightAddContact 0.3s forwards";
}

function openOverlayEditContact(contactId) {
  let contact = arrayOfContacts.find((c) => c.id === contactId);
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayEditCardRef = document.getElementById("overlay_edit_contact_card");
  overlayEditCardRef.innerHTML = getTemplateOfContactEdit(contact);
  overlayRef.classList.add("overlay_background");
  overlayEditCardRef.classList.add("overlay_edit_contact_card");
  overlayEditCardRef.style.animation = "slideInFromRightAddContact 0.3s forwards";
}

function closeOverlayAddContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_add_contact_card");
  overlayRef.style.backgroundColor = "transparent";
  overlayCardRef.style.animation = "slideOutToRightAddContact 0.3s forwards";
  overlayCardRef.addEventListener(
    "animationend",
    () => {
      overlayRef.classList.remove("overlay_background");
      overlayCardRef.classList.remove("overlay_add_contact_card");
      overlayCardRef.style.animation = "";
      overlayRef.style.backgroundColor = "";
      deleteInputs();
    },
    { once: true }
  );
}

function overlayContactSuccessfullyCreated() {
  let overlayRef = document.getElementById("contact_successfully_created");
  overlayRef.classList.remove("d_none");
  overlayRef.classList.add("overlay_contact_successfully_created");
  overlayRef.style.animation = "slideInFromRightContactSuccessfullyCreated 0.3s forwards";
  setTimeout(() => {
    overlayRef.style.animation = "slideOutToRightContactSuccessfullyCreated 0.3s forwards";
  }, 800);
}

function overlayContactSuccessfullyEdited() {
  let overlayRef = document.getElementById("contact_successfully_edit");
  overlayRef.classList.remove("d_none");
  overlayRef.classList.add("overlay_contact_successfully_created");
  overlayRef.style.animation = "slideInFromRightContactSuccessfullyCreated 0.3s forwards";
  setTimeout(() => {
    overlayRef.style.animation = "slideOutToRightContactSuccessfullyCreated 0.3s forwards";
  }, 800);
}

function overlayContactSuccessfullyDelete() {
  let overlayRef = document.getElementById("contact_successfully_deleted");
  overlayRef.classList.remove("d_none");
  overlayRef.classList.add("overlay_contact_successfully_created");
  overlayRef.style.animation = "slideInFromRightContactSuccessfullyCreated 0.3s forwards";
  setTimeout(() => {
    overlayRef.style.animation = "slideOutToRightContactSuccessfullyCreated 0.3s forwards";
  }, 800);
}

function setTimeoutSuccessfullyOverlayAddContact() {
  setTimeout(() => {
    overlayContactSuccessfullyCreated();
  }, 200);
}

function setTimeoutSuccessfullyOverlayEdit() {
  setTimeout(() => {
    overlayContactSuccessfullyEdited();
  }, 200);
}

function setTimeoutDeleteOverlayContact() {
  setTimeout(() => {
    overlayContactSuccessfullyDelete();
  }, 200);
}

function closeOverlayEditContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_edit_contact_card");
  overlayRef.style.backgroundColor = "transparent";
  overlayCardRef.style.animation = "slideOutToRightAddContact 0.3s forwards";
  overlayCardRef.addEventListener(
    "animationend",
    () => {
      overlayRef.classList.remove("overlay_background");
      overlayCardRef.classList.remove("overlay_edit_contact_card");
      overlayCardRef.style.animation = "";
      overlayRef.style.backgroundColor = "";
    },
    { once: true }
  );
}

function toggleOverlayContactInfos(index) {
  let overlay = document.getElementById("overlay_contact_infos");
  let contactElement = document.getElementById(`contact_${index}`);
  let contact = arrayOfContacts[index];
  if (contactElement.classList.contains("contact_active")) {
    ifContactElementContainsContactActive(overlay, contactElement);
  } else {
    removeActiveClassFromContacts();
    elseContactElementContainsContactActive(overlay, contactElement, contact);
  }
}

function removeActiveClassFromContacts() {
  const activeContacts = document.querySelectorAll(".contact_active");
  for (let i = 0; i < activeContacts.length; i++) {
    activeContacts[i].classList.remove("contact_active");
    activeContacts[i].classList.add("hover_contact_list");
  }
}

function ifContactElementContainsContactActive(overlay, contactElement) {
  contactElement.classList.remove("contact_active");
  contactElement.classList.add("hover_contact_list");
  overlay.style.animation = "slideOutToRightContactInfos 0.3s forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
    },
    { once: true }
  );
}

function elseContactElementContainsContactActive(overlay, contactElement, contact) {
  contactElement.classList.add("contact_active");
  contactElement.classList.remove("hover_contact_list");
  overlay.innerHTML = getTemplateOfContactInfo(contact);
  if (overlay.classList.contains("d_none")) {
    overlay.classList.remove("d_none");
    overlay.style.animation = "slideInFromRightContactInfos 0.3s forwards";
  } else {
    elseOverlayContactInfosGoOut(overlay, contact);
  }
}

function elseOverlayContactInfosGoOut(overlay, contact) {
  overlay.style.animation = "slideOutToRightContactInfos 0.3s forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
      overlay.innerHTML = getTemplateOfContactInfo(contact);
      overlay.classList.remove("d_none");
      overlay.style.animation = "slideInFromRightContactInfos 0.3s forwards";
    },
    { once: true }
  );
}
