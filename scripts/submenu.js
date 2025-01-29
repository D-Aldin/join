let submenuRef = document.getElementById("submenu_position");
let accountImg = document.querySelector(".account_img");

function toggleShowSubmenu() {
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

window.addEventListener("click", function (event) {
  if (event.target != submenuRef && event.target != accountImg) {
    submenuRef.classList.add("d_none");
    submenuRef.classList.remove("submenu_position");
    accountImg.classList.remove("active");
  }
});
