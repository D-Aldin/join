let submenuRef = document.getElementById("submenu_position");
let accountImg = document.querySelector(".account_circle");

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

window.addEventListener("click", function (event) {
  if (event.target != submenuRef && event.target != accountImg) {
    submenuRef.style.animation = "slideOutToRightSubmenu 125ms forwards";
    setTimeout(() => {
      submenuRef.classList.add("d_none");
      submenuRef.classList.remove("submenu_position");
      accountImg.classList.remove("active");
    }, 125);
  }
});

function getInitials(name) {
  let words = name.split(" ");
  let initialsArray = words.map(function (word) {
    let firstLetter = word.charAt(0).toUpperCase();
    return firstLetter;
  });
  let initials = initialsArray.join("");
  return initials;
}
