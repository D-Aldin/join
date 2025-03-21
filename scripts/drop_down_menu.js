/**
 * Toggles the visibility of the menu.
 * If visible, clicking outside will close it.
 */

function openMenu() {
  const contentMenu = document.querySelector(".content");
  const contentWindow = document.querySelector("#box");
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

/**
 * Toggles the visibility of the add task menu.
 * If visible, clicking outside will close it.
 */
function openMenuSectionAddTask() {
  const contentMenu = document.querySelector(".contentSectionAddTask");
  const addTaskWindow = document.querySelector("#add_task_box");
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
