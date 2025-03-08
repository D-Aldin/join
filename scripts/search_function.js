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
    statusCounter = 0;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(collectTasks, 500);
  searchFunk();
});

function noTaskFound(list, counter) {
  if (list.length === counter) {
    refMessage.classList.remove("d_none");
  }
  if (list.length != counter) {
    refMessage.classList.add("d_none");
  }
}
