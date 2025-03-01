BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
let submenuRef = document.getElementById("submenu_position");
let accountImg = document.querySelector(".account_circle");
let editButton = document.querySelector(".responsive_edit_contact");

function toggleShowSubmenu() {
  if (submenuRef.classList.contains("d_none")) {
    submenuRef.classList.remove("d_none");
    submenuRef.classList.add("submenu_position");
    accountImg.classList.add("active");
    submenuRef.style.animation = "slideInFromRightSubmenu 125ms forwards";
  } else {
    submenuRef.style.animation = "slideOutToRightSubmenu 125ms forwards";
    setTimeout(() => {
      submenuRef.classList.add("d_none");
      submenuRef.classList.remove("submenu_position");
      accountImg.classList.remove("active");
    }, 125);
  }
}

function openEditOverlay() {
  let submenuEditRef = document.getElementById("submenu_edit_position");
  if (submenuEditRef && submenuEditRef.classList.contains("d_none")) {
    submenuEditRef.classList.remove("d_none");
    submenuEditRef.classList.add("submenu_edit_position");
    submenuEditRef.style.animation = "slideInFromRightSubmenu 125ms forwards";
  }
}

window.addEventListener("click", function (event) {
  if (event.target != submenuRef && event.target != accountImg && !submenuRef.contains(event.target)) {
    submenuRef.style.animation = "slideOutToRightSubmenu 125ms forwards";
    setTimeout(() => {
      submenuRef.classList.add("d_none");
      submenuRef.classList.remove("submenu_position");
      accountImg.classList.remove("active");
    }, 125);
  }

  let submenuEditRef = document.getElementById("submenu_edit_position");
  const clickedEditButton = event.target.closest(".responsive_edit_contact");
  if (submenuEditRef && event.target != submenuEditRef && !submenuEditRef.contains(event.target) && !clickedEditButton) {
    submenuEditRef.style.animation = "slideOutToRightSubmenu 125ms forwards";
    setTimeout(() => {
      submenuEditRef.classList.add("d_none");
      submenuEditRef.classList.remove("submenu_edit_position");
    }, 125);
  }
});
