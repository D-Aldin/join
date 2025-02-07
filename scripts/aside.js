document.addEventListener("DOMContentLoaded", function () {
  activeLink();
  addContainerClickListeners();
  addLegalNotesClickListeners();
});

function activeLink() {
  const currentPath = window.location.pathname
    .split("/")
    .pop()
    .replace(/\.html$/, "");
  console.log(currentPath);
  const links = document.querySelectorAll(".nav_position a");
  updateActiveLinks(links, currentPath);
}

function updateActiveLinks(links, currentPath) {
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const linkPath = link
      .getAttribute("href")
      .split("/")
      .pop()
      .replace(/\.html$/, "");

    if (currentPath === linkPath) {
      link.parentElement.classList.add("active_background_color");
    } else {
      link.parentElement.classList.remove("active_background_color");
    }
  }
}

function addContainerClickListeners() {
  const containers = document.querySelectorAll(".link_nav_summary, .link_nav_add_task, .link_nav_board, .link_nav_contacts");
  for (let i = 0; i < containers.length; i++) {
    containers[i].addEventListener("click", function () {
      const link = this.querySelector("a");
      if (link) {
        window.location.href = link.getAttribute("href");
      }
    });
  }
}

// nochmal anschauen

// function addLegalNotesClickListeners() {
//   const legalNotesLinks = document.querySelectorAll(".legal_notes_position a");
//   for (let i = 0; i < legalNotesLinks.length; i++) {
//     legalNotesLinks[i].addEventListener("click", function (event) {
//       event.preventDefault();
//       window.location.href = this.getAttribute("href");
//     });
//   }
// }
