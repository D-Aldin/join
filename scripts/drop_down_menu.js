const contentMenu = document.querySelector(".contentSectionAddTask");
const addTaskWindow = document.querySelector("#add_task_box");
const contentWindow = document.querySelector("#box");

function openMenu() {
  const contentMenu = document.querySelector(".content");
  if (contentMenu.style.display === "inline") {
    contentMenu.style.display = "none";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down.svg";
  } else {
    contentMenu.style.display === "none";
    contentMenu.style.display = "inline";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down_up.svg";
    contentWindow.addEventListener("click", function (event) {
      if (!event.target.hasAttribute("id_value") && event.target.classList.contains("dropdown_button") === false) {
        contentMenu.style.display = "none";
      }
    });
  }
}

function openMenuSectionAddTask() {
  if (contentMenu.style.display === "inline") {
    contentMenu.style.display = "none";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down.svg";
  } else {
    contentMenu.style.display === "none";
    contentMenu.style.display = "inline";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down_up.svg";
    addTaskWindow.addEventListener("click", function (event) {
      if (!event.target.hasAttribute("id_value") && event.target.classList.contains("dropdown_button") === false) {
        contentMenu.style.display = "none";
      }
    });
  }
}
