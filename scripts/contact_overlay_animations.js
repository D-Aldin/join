/**
 * Closes the contact information overlay after deleting a contact
 * Animates the overlay sliding out to the right and hides it
 */
function closeOverlayContactInfoAfterDelete() {
  let overlay = document.getElementById("overlay_contact_infos");
  overlay.style.animation = "slideOutToRight 125ms forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
    },
    { once: true }
  );
}

/**
 * Opens the overlay for adding a new contact
 * Shows the background overlay and animates the contact card sliding in from the right
 */
function openOverlayAddContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_add_contact_card");
  overlayRef.classList.add("overlay_background");
  overlayCardRef.classList.add("overlay_add_contact_card");
  overlayCardRef.style.animation = "slideInFromRight 125ms forwards";
}

/**
 * Opens the overlay for editing an existing contact
 * @param {string} contactId - The unique identifier of the contact to edit
 */
function openOverlayEditContact(contactId) {
  let contact = arrayOfContacts.find((c) => c.id === contactId);
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayEditCardRef = document.getElementById("overlay_edit_contact_card");
  overlayEditCardRef.innerHTML = getTemplateOfContactEdit(contact);
  overlayRef.classList.add("overlay_background");
  overlayEditCardRef.classList.add("overlay_edit_contact_card");
  overlayEditCardRef.style.animation = "slideInFromRight 125ms forwards";
}

/**
 * Closes the add contact overlay
 * Animates the card sliding out to the right and removes overlay classes
 * Clears input fields after animation completes
 */
function closeOverlayAddContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_add_contact_card");
  overlayRef.style.backgroundColor = "transparent";
  overlayCardRef.style.animation = "slideOutToRight 125ms forwards";
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

/**
 * Displays a success message when a contact is created
 * Shows the message with a slide-in animation and automatically hides it after a delay
 */
function overlayContactSuccessfullyCreated() {
  let overlayRef = document.getElementById("contact_successfully_created");
  overlayRef.classList.remove("d_none");
  overlayRef.classList.add("overlay_contact_successfully_created");
  overlayRef.style.animation = "slideInFromRight 125ms forwards";
  setTimeout(() => {
    overlayRef.style.animation = "slideOutToRight 125ms forwards";
  }, 800);
}

/**
 * Displays a success message when a contact is edited
 * Shows the message with a slide-in animation and automatically hides it after a delay
 */
function overlayContactSuccessfullyEdited() {
  let overlayRef = document.getElementById("contact_successfully_edit");
  overlayRef.classList.remove("d_none");
  overlayRef.classList.add("overlay_contact_successfully_created");
  overlayRef.style.animation = "slideInFromRight 125ms forwards";
  setTimeout(() => {
    overlayRef.style.animation = "slideOutToRight 125ms forwards";
  }, 800);
}

/**
 * Displays a success message when a contact is deleted
 * Shows the message with a slide-in animation and automatically hides it after a delay
 */
function overlayContactSuccessfullyDelete() {
  let overlayRef = document.getElementById("contact_successfully_deleted");
  overlayRef.classList.remove("d_none");
  overlayRef.classList.add("overlay_contact_successfully_created");
  overlayRef.style.animation = "slideInFromRight 125ms forwards";
  setTimeout(() => {
    overlayRef.style.animation = "slideOutToRight 125ms forwards";
  }, 800);
}

/**
 * Sets a short delay before showing the contact created success message
 */
function setTimeoutSuccessfullyOverlayAddContact() {
  setTimeout(() => {
    overlayContactSuccessfullyCreated();
  }, 200);
}

/**
 * Sets a short delay before showing the contact edited success message
 */
function setTimeoutSuccessfullyOverlayEdit() {
  setTimeout(() => {
    overlayContactSuccessfullyEdited();
  }, 200);
}

/**
 * Sets a short delay before showing the contact deleted success message
 */
function setTimeoutDeleteOverlayContact() {
  setTimeout(() => {
    overlayContactSuccessfullyDelete();
  }, 200);
}

/**
 * Closes the edit contact overlay with animation
 * Clears all validation error messages after animation completes
 */
function closeOverlayEditContact() {
  let overlayRef = document.getElementById("overlay_add_contacts_background");
  let overlayCardRef = document.getElementById("overlay_edit_contact_card");
  overlayRef.style.backgroundColor = "transparent";
  overlayCardRef.style.animation = "slideOutToRight 125ms forwards";
  overlayCardRef.addEventListener(
    "animationend",
    () => {
      overlayRef.classList.remove("overlay_background");
      overlayCardRef.classList.remove("overlay_edit_contact_card");
      overlayCardRef.style.animation = "";
      overlayRef.style.backgroundColor = "";
      clearErrorMessages();
    },
    { once: true }
  );
}

/**
 * Toggles the contact information overlay for a specific contact
 * If the contact is already active, it closes the overlay
 * If the contact is not active, it shows the overlay with contact details
 *
 * @param {number} index - The index of the contact in the contacts array
 */
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

/**
 * Closes the contact information overlay
 * Animates the overlay sliding out to the right and removes active states from contacts
 */
function closeContactInfoOverlay() {
  let overlay = document.getElementById("overlay_contact_infos");
  overlay.style.animation = "slideOutToRight 125ms forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
      removeActiveClassFromContacts();
    },
    { once: true }
  );
}

/**
 * Removes the active class from all contacts in the list
 * Restores hover effect on all contacts
 */
function removeActiveClassFromContacts() {
  const activeContacts = document.querySelectorAll(".contact_active");
  for (let i = 0; i < activeContacts.length; i++) {
    activeContacts[i].classList.remove("contact_active");
    activeContacts[i].classList.add("hover_contact_list");
  }
}

/**
 * Handles the case when a contact element already has the active class
 * Removes active styling and closes the overlay with animation
 *
 * @param {HTMLElement} overlay - The contact info overlay element
 * @param {HTMLElement} contactElement - The contact element in the list
 */
function ifContactElementContainsContactActive(overlay, contactElement) {
  contactElement.classList.remove("contact_active");
  contactElement.classList.add("hover_contact_list");
  overlay.style.animation = "slideOutToRight 125ms forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
    },
    { once: true }
  );
}

/**
 * Handles the case when a contact element doesn't have the active class
 * Adds active styling to the contact and displays its information in the overlay
 *
 * @param {HTMLElement} overlay - The contact info overlay element
 * @param {HTMLElement} contactElement - The contact element in the list
 * @param {Object} contact - The contact data object to display
 */
function elseContactElementContainsContactActive(overlay, contactElement, contact) {
  contactElement.classList.add("contact_active");
  contactElement.classList.remove("hover_contact_list");
  overlay.innerHTML = getTemplateOfContactInfo(contact);
  if (overlay.classList.contains("d_none")) {
    overlay.classList.remove("d_none");
    overlay.style.animation = "slideInFromRight 125ms forwards";
  } else {
    elseOverlayContactInfosGoOut(overlay, contact);
  }
}

/**
 * Handles animation for changing contact information in an already open overlay
 * Slides out the current overlay, updates content, then slides it back in
 *
 * @param {HTMLElement} overlay - The contact info overlay element
 * @param {Object} contact - The new contact data object to display
 */
function elseOverlayContactInfosGoOut(overlay, contact) {
  overlay.style.animation = "slideOutToRight 125ms forwards";
  overlay.addEventListener(
    "animationend",
    () => {
      overlay.classList.add("d_none");
      overlay.style.animation = "";
      overlay.innerHTML = getTemplateOfContactInfo(contact);
      overlay.classList.remove("d_none");
      overlay.style.animation = "slideInFromRight 125ms forwards";
    },
    { once: true }
  );
}
