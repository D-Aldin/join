function openMenu() {
  const contentMenu = document.querySelector(".content");
  if (contentMenu.style.display === "inline") {
    contentMenu.style.display = "none";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down.svg";
  } else {
    contentMenu.style.display === "none";
    contentMenu.style.display = "inline";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down_up.svg";
  }
}

function openMenuSectionAddTask() {
  const contentMenu = document.querySelector(".contentSectionAddTask");
  if (contentMenu.style.display === "inline") {
    contentMenu.style.display = "none";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down.svg";
  } else {
    contentMenu.style.display === "none";
    contentMenu.style.display = "inline";
    document.querySelector("#arrow").src = "./assets/icons/board/arrow_drop_down_up.svg";
  }
}
