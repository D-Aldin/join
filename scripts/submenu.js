/** Firebase database base URL */
BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";

/** Reference to the submenu DOM element */
let submenuRef = document.getElementById("submenu_position");

/** Reference to the account circle DOM element */
let accountImg = document.querySelector(".account_circle");

/** Reference to the edit contact button DOM element */
let editButton = document.querySelector(".responsive_edit_contact");

/**
 * Toggles the visibility of the submenu with animation.
 * If submenu is hidden, it will be shown with a slide-in animation.
 * If submenu is visible, it will be hidden with a slide-out animation.
 */
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

/**
 * Opens the edit overlay with a slide-in animation.
 * The overlay is only opened if it exists and is currently hidden.
 */
function openEditOverlay() {
  let submenuEditRef = document.getElementById("submenu_edit_position");
  if (submenuEditRef && submenuEditRef.classList.contains("d_none")) {
    submenuEditRef.classList.remove("d_none");
    submenuEditRef.classList.add("submenu_edit_position");
    submenuEditRef.style.animation = "slideInFromRight 125ms forwards";
  }
}

/**
 * Event listener for handling clicks outside of the submenu and edit overlay.
 * Closes the respective menu when clicking outside of it.
 *
 * @param {Event} event - The click event object
 */
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

/**
 * Closes the main submenu with a slide-out animation.
 * After animation completes, the submenu is hidden and styling is reset.
 */
function closeMainSubmenu() {
  submenuRef.style.animation = "slideOutToRight 125ms forwards";
  setTimeout(() => {
    submenuRef.classList.add("d_none");
    submenuRef.classList.remove("submenu_position");
    accountImg.classList.remove("active");
  }, 125);
}

/**
 * Closes the edit submenu with a slide-out animation.
 * After animation completes, the submenu is hidden and styling is reset.
 *
 * @param {HTMLElement} submenuEditRef - Reference to the edit submenu DOM element
 */
function closeEditSubmenu(submenuEditRef) {
  submenuEditRef.style.animation = "slideOutToRight 125ms forwards";
  setTimeout(() => {
    submenuEditRef.classList.add("d_none");
    submenuEditRef.classList.remove("submenu_edit_position");
  }, 125);
}
