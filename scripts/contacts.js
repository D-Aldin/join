function openOverlay() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayCardRef = document.getElementById('overlay_add_contact_card');
  overlayRef.classList.add('overlay_background');
  overlayCardRef.classList.add('overlay_add_contact_card');
  overlayCardRef.style.animation = 'slideInFromRightAddContact 0.3s forwards';
}

function closeOverlay() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayCardRef = document.getElementById('overlay_add_contact_card');
  overlayRef.style.backgroundColor = 'transparent';
  overlayCardRef.style.animation = 'slideOutToRightAddContact 0.3s forwards';
  overlayCardRef.addEventListener('animationend', () => {
    overlayRef.classList.remove('overlay_background');
    overlayCardRef.classList.remove('overlay_add_contact_card');
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