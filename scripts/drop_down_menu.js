/**
 * Toggles the visibility of the content menu. If the menu is currently displayed inline,
 * it will be hidden; otherwise, it will be shown. It also updates the arrow icon accordingly.
 *
 * @function openMenu
 */
function openMenu() {
  const contentMenu = document.querySelector(".content");
  if (contentMenu.style.display === "inline") {
    contentMenu.style.display = "none";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down.svg";
  } else {
    contentMenu.style.display === "none";
    contentMenu.style.display = "inline";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down_up.svg";
    document.addEventListener(
      "click",
      function handleClickOutside(event) {
        if (!event.target.hasAttribute("id_value") && event.target.classList.contains("dropdown_button") === false) {
          contentMenu.style.display = "none";
          document.removeEventListener("click", handleClickOutside);
        }
      },
      { once: true }
    );
  }
}

/**
 * Toggles the visibility of the "contentSectionAddTask" menu. If the menu is currently displayed inline,
 * it will be hidden; otherwise, it will be shown. It also updates the arrow icon accordingly.
 *
 * @function openMenuSectionAddTask
 */
function openMenuSectionAddTask() {
  const contentMenu = document.querySelector(".contentSectionAddTask");
  if (contentMenu.style.display === "inline") {
    contentMenu.style.display = "none";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down.svg";
  } else {
    contentMenu.style.display === "none";
    contentMenu.style.display = "inline";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down_up.svg";
    document.addEventListener(
      "click",
      function handleClickOutside(event) {
        if (!event.target.hasAttribute("id_value") && event.target.classList.contains("dropdown_button") === false) {
          contentMenu.style.display = "none";
          document.removeEventListener("click", handleClickOutside);
        }
      },
      { once: true }
    );
  }
}
