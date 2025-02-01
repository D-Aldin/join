BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

let arrayOfContacts = [];

async function init() {
  await getContactsFromDataBase();
  renderContacts();
}

async function addContactToDataBase() {
  let counterResponse = await fetch(BASE_URL + "contactCounter.json");
  let counterData = await counterResponse.json();
  let newIndex = (counterData || 0) + 1;
  let name = document.getElementById('add_name').value;
  let email = document.getElementById('add_email').value;
  let phone = document.getElementById('add_phone').value;
  let response = await fetch(BASE_URL + `contacts/contact_${newIndex}.json`, {
    method: "PUT",
    body: JSON.stringify({
      name: name,
      email: email,
      phone: phone
    }),
  });
  let contactData = await response.json();
  await fetch(BASE_URL + "contactCounter.json", {
    method: "PUT",
    body: JSON.stringify(newIndex),
  });
  arrayOfContacts.push(contactData);
  renderContacts();
  closeOverlayAddContact();
  return contactData;
}

async function getContactsFromDataBase() {
  let response = await fetch(BASE_URL + "contacts.json");
  let data = await response.json();
  try {
    for (let key in data) {
      let contact = {
        name: data[key].name,
        email: data[key].email,
        phone: data[key].phone
      };
      arrayOfContacts.push(contact);
    }
    console.log(arrayOfContacts);
    return arrayOfContacts;
  } catch (error) {
    console.error('Fehler beim Laden der Kontakte:', error); 
  }
}

function renderContacts() {
  let contactList = document.getElementById('contact_list');
  contactList.innerHTML = '';
  for (let i = 0; i < arrayOfContacts.length; i++) {
    const contacts = arrayOfContacts[i];
    contactList.innerHTML += getTemplateOfRenderContacts(contacts, i);
  }
}

function openOverlayAddContact() {
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

function overlayContactSuccessfullyCreated() {
  let overlayRef = document.getElementById('contact_successfully_created');
  overlayRef.classList.remove('d_none');
  overlayRef.classList.add('overlay_contact_successfully_created');
  overlayRef.style.animation = 'slideInFromRightContactSuccessfullyCreated 0.3s forwards';
  setTimeout(() => {
    overlayRef.style.animation = 'slideOutToRightContactSuccessfullyCreated 0.3s forwards';
  }, 800);
}

function setTimeoutSuccessfullyOverlay() {
  setTimeout(() => {
    overlayContactSuccessfullyCreated();
  }, 400);
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