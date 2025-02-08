BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

selectedButton = '';

let subtasks = [];

function render() {
}

async function renderContacts() {
    let contacts = await fetch(BASE_URL.contact)
    console.log(contacts);
    try {
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            let name = contact.name;
            let color = contact.color;
            console.log(contact);
            console.log(color);
            console.log(name);        
        }
    } catch (error) {
        console.log(error);
    }
}

function contactTemplate(name, color) {
    let contactlist = document.getElementById('contact-list');
        contactlist.innerHTML = /*html*/`
            <option class="datalist" value="">
                ${name},
            </option>
        `  
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

function creatTask() {
    let title = document.getElementById('').value;
    let discription = document.getElementById('').value;
    let date = document.getElementById('').value;
    let category = document.getElementById('').value;
}

function clearAllTasks() {
    console.log('hello');
    resetPrioButton();
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    document.getElementById('subtask').value = '';
}

function writeSubtask() {
    let subtask = document.getElementById('subtask').value  
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
            </button>
        `
}

function clearsubtask() {
    document.getElementById('subtask').value = '';
    setStandardButton();
}

function setSubtask() {
    let subtask = document.getElementById('subtask').value
    subtasks.push(subtask);
    renderSubtasks();
    clearsubtask();
}

function renderSubtasks() {
    let tasks = document.getElementById('tasks-wrapper');
    tasks.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        tasks.innerHTML += /*html*/`
        <div id="${i}" class="subtask-list">
            <ul>
                <li>${element}</li>   
            </ul>
            <div class="subtask-list-button-container">
                <button onclick="editSubtask(${i})" class="subtask-list-button"><img src="assets/icons/addTask/pen.svg" alt=""></button>
                <div class="pixelbar-subtask"></div>
                <button onclick="deleteSubtask(${i})" class="subtask-list-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
            </div>
        </div>
        `
    }
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
        </div>
    `
    currentsubtask = document.getElementById('current-subtask'+x);
    currentsubtask.value = subtasks[x];
}

function setEditSubtask(x) {
    subtasks.splice(x, 1);
    let subtask = document.getElementById('current-subtask'+x).value
    subtasks.splice(x, 0, subtask);
    renderSubtasks();
}
