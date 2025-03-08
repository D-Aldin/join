BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
let submenuRef = document.getElementById("submenu_position");
let accountImg = document.querySelector(".account_circle");
let editButton = document.querySelector(".responsive_edit_contact");

function toggleShowSubmenu() {
  if (submenuRef.classList.contains("d_none")) {
    submenuRef.classList.remove("d_none");
    submenuRef.classList.add("submenu_position");
    accountImg.classList.add("active");
    submenuRef.style.animation = "slideInFromRight 125ms forwards";
  } else {
    submenuRef.style.animation = "slideOutToRight 125ms forwards";
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
    submenuEditRef.style.animation = "slideInFromRight 125ms forwards";
  }
}

window.addEventListener("click", function (event) {
  let submenuEditRef = document.getElementById("submenu_edit_position");
  const clickedEditButton = event.target.closest(".responsive_edit_contact");
  if (event.target != submenuRef && event.target != accountImg && !submenuRef.contains(event.target)) {
    closeMainSubmenu();
  }
  if (submenuEditRef && event.target != submenuEditRef && !submenuEditRef.contains(event.target) && !clickedEditButton) {
    closeEditSubmenu(submenuEditRef);
  }
});

function closeMainSubmenu() {
  submenuRef.style.animation = "slideOutToRight 125ms forwards";
  setTimeout(() => {
    submenuRef.classList.add("d_none");
    submenuRef.classList.remove("submenu_position");
    accountImg.classList.remove("active");
  }, 125);
}

function closeEditSubmenu(submenuEditRef) {
  submenuEditRef.style.animation = "slideOutToRight 125ms forwards";
  setTimeout(() => {
    submenuEditRef.classList.add("d_none");
    submenuEditRef.classList.remove("submenu_edit_position");
  }, 125);
}
