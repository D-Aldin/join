const searchFiled = document.querySelector("#searchbar");
const refMessage = document.querySelector(".no_found");
const listOfTasks = [];
let statusCounter = 0;

function collectTasks() {
  const cards = document.querySelectorAll("article");
  cards.forEach((element) => {
    let card = element;
    let title = element.firstElementChild.nextElementSibling.innerText;
    let description = element.firstElementChild.nextElementSibling.nextElementSibling.innerText;
    listOfTasks.push({ card, title, description });
  });

  return listOfTasks;
}

function searchFunk() {
  searchFiled.addEventListener("input", function () {
    let userInput = searchFiled.value.toLowerCase();
    statusCounter = 0;
    listOfTasks.forEach((element) => {
      let isVisible = element.title.toLowerCase().includes(userInput);
      element.card.classList.toggle("hide", !isVisible);
      if (isVisible === false) {
        statusCounter += 1;
        noTaskFound(listOfTasks, statusCounter);
      }
      if (searchFiled.value == "") {
        refMessage.classList.add("d_none");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(collectTasks, 500);
  searchFunk();
});

function noTaskFound(list, counter) {
  if (list.length === counter) {
    refMessage.classList.remove("d_none");
    refMessage.style.animation = "slideInFromRight 125ms ease forwards";
  }
  if (list.length != counter) {
    refMessage.classList.add("d_none");
  }
}
