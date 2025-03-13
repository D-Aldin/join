/**
 * Handles priority button selection and updates styling.
 * @param {Event} event - The event triggering the priority selection.
 */
function buttonUrgent(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnUrgent.style = "background-color:rgb(255, 61, 0); color: white";
  document.querySelector("#iconurgent").firstChild.src = "./assets/icons/addTask/icon_clicket_urgent.svg";
  if (btnMedium.hasAttribute("style") || btnLow.hasAttribute("style")) {
    btnMedium.removeAttribute("style");
    btnLow.removeAttribute("style");
    document.querySelector("#iconmedium").firstChild.src = "assets/icons/addTask/icon_medium.svg";
    document.querySelector("#iconlow").firstChild.src = "assets/icons/addTask/icon_low.svg";
  }
}

/**
 * Handles priority button selection and updates styling.
 * @param {Event} event - The event triggering the priority selection.
 */
function buttonMedium(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnMedium.style = "background-color:rgb(255, 168, 0); color: white";
  document.querySelector("#iconmedium").firstChild.src = "./assets/icons/addTask/icon_clicket_medium.svg";
  if (btnUrgent.hasAttribute("style") || btnLow.hasAttribute("style")) {
    btnUrgent.removeAttribute("style");
    btnLow.removeAttribute("style");
    document.querySelector("#iconurgent").firstChild.src = "assets/icons/addTask/icon_urgent.svg";
    document.querySelector("#iconlow").firstChild.src = "assets/icons/addTask/icon_low.svg";
  }
  storeThePrioValue = "medium";
}

/**
 * Handles priority button selection and updates styling.
 * @param {Event} event - The event triggering the priority selection.
 */
function buttonLow(event) {
  let btnUrgent = document.querySelector("#urgent");
  let btnMedium = document.querySelector("#medium");
  let btnLow = document.querySelector("#low");
  storeThePrioValue = event.currentTarget.id;
  btnLow.style = "background-color: rgb(122, 226, 41); color: white";
  document.querySelector("#iconlow").firstChild.src = "./assets/icons/addTask/icon_clicket_low.svg";
  if (btnMedium.hasAttribute("style") || btnUrgent.hasAttribute("style")) {
    btnMedium.removeAttribute("style");
    btnUrgent.removeAttribute("style");
    document.querySelector("#iconmedium").firstChild.src = "assets/icons/addTask/icon_medium.svg";
    document.querySelector("#iconurgent").firstChild.src = "assets/icons/addTask/icon_urgent.svg";
  }
  storeThePrioValue = "low";
}
