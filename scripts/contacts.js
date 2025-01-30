function openOverlay() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayCardRef = document.getElementById('overlay_add_contact_card');
  overlayRef.classList.add('overlay_background');
  overlayCardRef.classList.add('overlay_add_contact_card');
  overlayCardRef.style.animation = 'slideInFromRightAddContact 0.3s forwards';
}

function openOverlayEditContact() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayEditCardRef = document.getElementById('overlay_edit_contact_card');
  overlayRef.classList.add('overlay_background');
  overlayEditCardRef.classList.add('overlay_edit_contact_card');
  overlayEditCardRef.style.animation = 'slideInFromRightAddContact 0.3s forwards';
}

function deleteInputs() {
  let inputs = document.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
  }
}

// function saveChangesContact() {
  
// }

function closeOverlayAddContact() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayCardRef = document.getElementById('overlay_add_contact_card');
  let inputs = document.querySelectorAll('input');
  overlayRef.style.backgroundColor = 'transparent';
  overlayCardRef.style.animation = 'slideOutToRightAddContact 0.3s forwards';
  overlayCardRef.addEventListener('animationend', () => {
    overlayRef.classList.remove('overlay_background');
    overlayCardRef.classList.remove('overlay_add_contact_card');
    overlayCardRef.style.animation = '';
    overlayRef.style.backgroundColor = '';
    deleteInputs();
  }, { once: true });
}

function closeOverlayEditContact() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayCardRef = document.getElementById('overlay_edit_contact_card');
  overlayRef.style.backgroundColor = 'transparent';
  overlayCardRef.style.animation = 'slideOutToRightAddContact 0.3s forwards';
  overlayCardRef.addEventListener('animationend', () => {
    overlayRef.classList.remove('overlay_background');
    overlayCardRef.classList.remove('overlay_edit_contact_card');
    overlayCardRef.style.animation = '';
    overlayRef.style.backgroundColor = '';
  }, { once: true });
}

function toggleOverlayContactInfos() {
  let overlayCardRef = document.getElementById('overlay_contact_infos');
  let contact = document.getElementById('contact');
  if (overlayCardRef.classList.contains('d_none')) {
    contact.classList.add('contact_active');
    contact.classList.remove('hover_contact_list');
    overlayCardRef.classList.remove('d_none');
    overlayCardRef.style.animation = 'slideInFromRightContactInfos 0.3s forwards';
  } else {
    overlayCardRef.style.animation = 'slideOutToRightContactInfos 0.3s forwards';
    contact.classList.remove('contact_active');
    contact.classList.add('hover_contact_list');
    overlayCardRef.addEventListener('animationend', () => {
      overlayCardRef.classList.add('d_none');
      overlayCardRef.style.animation = '';
    }, { once: true });
  }
}