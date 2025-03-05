const searchFiled = document.querySelector("#searchbar");
const listOfTasks = [];

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
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(collectTasks, 500);
  searchFunk();
});
