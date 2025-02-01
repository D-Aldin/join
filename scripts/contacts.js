BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

let arrayOfContacts = [];

async function init() {
  await getContactsFromDataBase();
  renderContacts();
}

async function addContactToDataBase() {
  let name = document.getElementById('add_name').value;
  let email = document.getElementById('add_email').value;
  let phone = document.getElementById('add_phone').value;
  const uniqueKey = `contact_${Date.now()}`;
  try {
    let response = await fetch(BASE_URL + `contacts/${uniqueKey}.json`, {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        email: email,
        phone: phone
      }),
    });
    let contactData = await response.json();
    arrayOfContacts.push({ id: uniqueKey, ...contactData });
    renderContacts();
    closeOverlayAddContact();
    deleteInputs();
    return contactData;
  } catch (error) {
    console.error('Fehler:', error);
  }
}

async function getContactsFromDataBase() {
  let response = await fetch(BASE_URL + "contacts.json");
  let data = await response.json();
  arrayOfContacts = [];
  try {
    for (let key in data) {
      let contact = {
        id: key,
        name: data[key].name,
        email: data[key].email,
        phone: data[key].phone
      };
      arrayOfContacts.push(contact);
    }
    return arrayOfContacts;
  } catch (error) {
    console.error('Fehler beim Laden der Kontakte:', error); 
  }
}

async function deleteContactFromList(id) {
  try {
    const response = await fetch(BASE_URL + `contacts/${id}.json`, {
      method: "DELETE",
    });
    arrayOfContacts = arrayOfContacts.filter(contact => contact.id !== id);
    renderContacts();
  } catch (error) {
    console.error('Fehler beim Löschen des Kontakts:', error);
  }
}

function deleteInputs() {
  let inputs = document.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
  }
}

// function saveChangesContact() {
  
// }

function renderContacts() {
  let contactList = document.getElementById('contact_list');
  contactList.innerHTML = '';
  for (let i = 0; i < arrayOfContacts.length; i++) {
    const contact = arrayOfContacts[i];
    contactList.innerHTML += getTemplateOfRenderContacts(contact, i);
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

function toggleOverlayContactInfos(index) {
  let overlay = document.getElementById('overlay_contact_infos');
  let contactElement = document.getElementById(`contact_${index}`);
  let contact = arrayOfContacts[index];
  overlay.innerHTML = getTemplateOfContactInfo(contact, index);
  if (overlay.classList.contains('d_none')) {
    overlay.classList.remove('d_none');
    overlay.style.animation = 'slideInFromRightContactInfos 0.3s forwards';
    contactElement.classList.add('contact_active');
    contactElement.classList.remove('hover_contact_list');
  } else {
    overlay.style.animation = 'slideOutToRightContactInfos 0.3s forwards';
    contactElement.classList.remove('contact_active');
    contactElement.classList.add('hover_contact_list');
    overlay.addEventListener('animationend', () => {
      overlay.classList.add('d_none');
      overlay.style.animation = '';
    }, { once: true });
  }
}