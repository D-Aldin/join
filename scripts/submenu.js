function toggleShowSubmenu() {
  let submenuRef = document.getElementById("submenu_position");
  let accountImg = document.querySelector(".account_img");
  if (submenuRef.classList.contains("d_none")) {
    submenuRef.classList.add("submenu_position");
    submenuRef.classList.remove("d_none");
    accountImg.classList.add("active");
  } else {
    submenuRef.classList.add("d_none");
    submenuRef.classList.remove("submenu_position");
    accountImg.classList.remove("active");
  }
}