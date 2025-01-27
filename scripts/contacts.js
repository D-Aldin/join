function openOverlayBackground() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayCardRef = document.getElementById('overlay_add_contact_card');
  overlayRef.classList.add('overlay_background');
  overlayCardRef.classList.add('overlay_add_contact_card');
  overlayCardRef.style.animation = 'slideInFromRight 0.5s forwards';
}

function closeOverlayBackground() {
  let overlayRef = document.getElementById('overlay_add_contacts_background');
  let overlayCardRef = document.getElementById('overlay_add_contact_card');
  overlayRef.style.backgroundColor = 'transparent';
  overlayCardRef.style.animation = 'slideOutToRight 0.5s forwards';
  overlayCardRef.addEventListener('animationend', () => {
    overlayRef.classList.remove('overlay_background');
    overlayCardRef.classList.remove('overlay_add_contact_card');
    overlayCardRef.style.animation = '';
    overlayRef.style.backgroundColor = '';
  }, { once: true });
}