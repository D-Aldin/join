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

function submitSubtask(subtask) {
    console.log(subtasks);
    subtask.value = '';
    renderSubtasks();
}

function clearsubtask() {
    document.getElementById('subtask').value = '';
    setStandardButton();
}

function setSubtask() {
    let subtask = document.getElementById('subtask').value
    subtasks.push(subtask);
    renderSubtasks();
}

function renderSubtasks() {
    let tasks = document.getElementById('tasks-wrapper');
    tasks.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        tasks.innerHTML += /*html*/`
        <ul>
            <div class="subtask-list">
                <li>${element}</li>   
                <div class="subtask-button-container">
                    <button class="subtask-inputfield-button"><img src="assets/icons/addTask/delete.svg" alt=""></button>
                    <button class="subtask-inputfield-button"><img src="assets/icons/addTask/done.svg" alt=""></button>
                </div>
            </div>
        </ul>
        `
    }
}

