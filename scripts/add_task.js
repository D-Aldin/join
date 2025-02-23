BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

selectedButton = '';

let subtasks = [];

arrayOfContacts = [];

function render() {
    renderContacts("contacts");
}

async function renderContacts(path="") {
    let response = await fetch(BASE_URL + path + ".json")
    let contacts = await response.json();
  try {
    for (let key in contacts) {
      let contact = {
        id: key,
        name: contacts[key].name,
        email: contacts[key].email,
        phone: contacts[key].phone,
        color: contacts[key].color,
      };
      arrayOfContacts.push(contact);
    }
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte:", error);
    }
    pushContactsToSelectField()
}

function pushContactsToSelectField() {
    let contactlist = document.getElementById('contact-list');
    for (let i = 0; i < arrayOfContacts.length; i++) {
        const currentContact = arrayOfContacts[i];

        contactlist.innerHTML += /*html*/`
            <div onclick="addContact(${i})" id="contact${i}" class="contactlist">
                <div class="contact-img-cyrcle" style="background-color: ${currentContact.color}"></div>
                ${currentContact.name}
                <img src="" alt="">
            </div>
        `  }
}

function openContactList() {
    let contactlist = document.getElementById('contact-list');
    let contactWrapper = document.getElementById('contact-wrapper');
    document.getElementById('contact-input-border').classList.add('subtask-inputfield-focus');
    document.getElementById('contact-input-field').innerHTML = /*html*/`
        <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa.svg" alt="">
    `
    contactlist.classList.remove('display_none');
    document.addEventListener("click", function outsideClick(event) {
        if (!contactWrapper.contains(event.target)) {
            closeContactList(contactlist);
            document.removeEventListener("click", outsideClick);
        }
    });
}

function closeContactList(contactlist) {    
    contactlist.classList.add('display_none');
    document.getElementById('contact-input-border').classList.remove('subtask-inputfield-focus');
    document.getElementById('contact-input-field').innerHTML = /*html*/`
        <img class="icon-drop-down" src="assets/icons/addTask/arrow_drop_downaa (1).svg" alt="">
    `
}

function addContact(x) {
    let addContact = document.getElementById('contact' + x);
    addContact.classList.remove('contactlist');
    addContact.classList.add('contactlist-clicket');

}

function setContact(x) {

}

function removeContact(x) {

}

function setPrio(x) {
    resetPrioButton()
    let button = document.getElementById(x);
    selectedButton = x;
    button.classList.add('backgroundcolor'+x);
    button.classList.remove('urgentbutton');
    document.getElementById('icon'+x).innerHTML = /*html*/`
        <img src="assets/icons/addTask/icon_clicket_${x}.svg" alt="">
    `
}

function resetPrioButton() {
    if (selectedButton == '' == false) {
        let button = document.getElementById(selectedButton);    
        button.classList.remove('backgroundcolor'+selectedButton);
        button.classList.add('urgentbutton');
        document.getElementById('icon'+selectedButton).innerHTML = /*html*/`
        <img src="assets/icons/addTask/icon_${selectedButton}.svg" alt="">
    `
    }
}

function submitTask() {
    event.preventDefault();
    const form = document.querySelector("form");
    if (form.reportValidity()) {
        finishTaskNotification();
        creatTask();
        clearAllTasks();
        window.location.href = "http://127.0.0.1:5501/board.html";
    } 
}

function creatTask() {
    document.getElementById("title").required = true;
    let title = document.getElementById('title').value;
    let discription = document.getElementById('description').value;
    let date = document.getElementById('date').value;
    let category = document.getElementById('category').value;
    console.log(title, discription, date, category);
}

function finishTaskNotification() {
    document.getElementById('finish-box').classList.add('finish-container-activ');
        setTimeout(()=>{
        document.getElementById('finish-box').classList.remove('finish-container-activ')
    }, 3000)
} 


function clearAllTasks() {
    resetPrioButton();
    subtasks = [];
    renderSubtasks();
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    document.getElementById('subtask').value = '';
}

function borderFocus() {
    let border = document.getElementById('subtusk-input-border')
    border.classList.add('subtask-inputfield-focus');
    document.addEventListener("click", function outsideClick(event) {
        if (!border.contains(event.target)) {
            border.classList.remove('subtask-inputfield-focus');
            document.removeEventListener("click", outsideClick);
        }
    });
}

function writeSubtask() {
    let subtask = document.getElementById('subtask').value;
    document.getElementById('subtusk-input-border').classList.add('subtask-inputfield-focus');
    if (subtask.length < 1) {
        setStandardButton();
    }
    if (subtask.length >= 1) {
        setdubbleButton();
    }
}

function setStandardButton() {
    document.getElementById('subtaskbuttons').innerHTML = /*html*/`
            <button class="subtask-inputfield-button">
                <img src="assets/icons/addTask/subtasks_icons.svg" alt="">
            </button>
        `
}

function setdubbleButton() {
    document.getElementById('subtaskbuttons').innerHTML = /*html*/`
            <button class="subtask-inputfield-button">
                <img onclick="clearsubtask()" src="assets/icons/addTask/cross.svg" alt="">
            </button>
            <div class="pixelbar-mini"></div>
            <button class="subtask-inputfield-button">    
                <img onclick="setSubtask()" src="assets/icons/addTask/done.svg" alt="">
            </button>`;
}

function clearsubtask() {
    document.getElementById('subtask').value = '';
    setStandardButton();
}

function setSubtask() {
    let subtask = document.getElementById('subtask').value;

    subtasks.push(subtask);
    renderSubtasks();
    clearsubtask();
}

function renderSubtasks() {
    let tasks = document.getElementById('tasks-wrapper');
    tasks.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        subtasksTemplate(tasks, i, element)
    }
}

function subtasksTemplate(tasks, i, element) {
    tasks.innerHTML += /*html*/`
        <div id="${i}" class="subtask-list" >
            <ul ondblclick="editSubtask(${i})">
                <li>${element}</li>   
            </ul>
            <div class="subtask-list-button-container">
                <button onclick="editSubtask(${i})" class="subtask-list-button"><img src="assets/icons/addTask/pen.svg" alt=""></button>
                <div class="pixelbar-subtask"></div>
                <button onclick="deleteSubtask(${i})" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
            </div>
        </div>`
}

function deleteSubtask(x) {
    subtasks.splice(x, 1);
    renderSubtasks();
}

function editSubtask(x) {
    currentcontainer = document.getElementById(x);
    currentcontainer.classList.remove('subtask-list');
    currentcontainer.classList.add('subtask-list-by-edit');
    document.getElementById(x).innerHTML = /*html*/`
        <input class="subtask-edit-inputfield" id="current-subtask${x}" type="text">
        <div class="subtask-list-button-container-by-edit">
                <button onclick="setEditSubtask(${x})" class="subtask-list-button"><img src="assets/icons/addTask/done.svg" alt=""></button>
                <div class="pixelbar-subtask"></div>
                <button onclick="deleteSubtask(${x})" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
        </div>`
    currentsubtask = document.getElementById('current-subtask'+x);
    currentsubtask.value = subtasks[x];
    /*
    document.addEventListener("click", function outsideClick(event) {
        if (!currentcontainer.contains(event.target)) {
            setEditSubtask(x);
            document.removeEventListener("click", outsideClick);
        }
    });*/
}

function setEditSubtask(x) {
    subtasks.splice(x, 1);
    let subtask = document.getElementById('current-subtask'+x).value
    subtasks.splice(x, 0, subtask);
    renderSubtasks();
}
