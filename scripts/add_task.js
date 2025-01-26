function render() {
    loadContact();
}

function loadContact() {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let contactlist = document.getElementById('contact-list');
        contactlist.innerHTML = /*html*/`
            <option class="datalist" value="">
                <img src="" alt=""><p></p><input type="checkbox">
            </option>

        `
    }
}

let buttons = {
    urgent: false,
    medium: false,
    low: false,
}

function setPrio(x) {
    let button = document.getElementById(x);
    if (buttons.y = true) {
        removePrio(x);
    } else {
        button.classList.add('backgroundcolor'+x);
    buttons.y = true}
    
}

function removePrio(x) {
    document.getElementById(x).classList.remove('backgroundcolor'+x);
}