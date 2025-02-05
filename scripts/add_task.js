function render() {
}

function loadContact() {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let name = contact.name;
        let img = contact.img;
        let contactlist = document.getElementById('contact-list');
        contactlist.innerHTML = /*html*/`
            <option class="datalist" value="">
                <img src="" alt=""><p></p><input type="checkbox">
            </option>
        `
    }
}

selectedButton = '';

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

function clear() {
    console.log('hello');
    resetPrioButton();
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    document.getElementById('subtask').value = '';
}