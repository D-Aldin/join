const listOfTasks = [];
const found = [];
const searchFiled = document.querySelector("#searchbar");
const temporaryList = document.querySelector("#temp");

function collectTasks() {
  setTimeout(() => {
    const refAllTasks = document.querySelectorAll("article");
    console.log(refAllTasks);
    refAllTasks.forEach((element) => {
      let id = element.getAttribute("id");
      let title = element.childNodes[3].innerText.toLowerCase();
      let discription = element.childNodes[5].innerText.toLowerCase();
      let createObject = { id: id, title: title, discription: discription };
      listOfTasks.push(createObject);
    });
  }, "100");
}

function search() {
  searchFiled.addEventListener("input", function () {
    const refAllTasks = document.querySelectorAll("article");
    refAllTasks.forEach((element) => {
      element.style.display = "none";
      if (listOfTasks.find((task) => task.title.slice(0, 3) === searchFiled.value || task.title === searchFiled.value)) {
        element.style.display = "block";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  collectTasks();
  search();
});
