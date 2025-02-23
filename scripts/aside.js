document.addEventListener("DOMContentLoaded", function () {
  activeLink();
  addContainerClickListeners();
  addLegalAndPolicyClickListeners();
});

function activeLink() {
  const currentPath = window.location.pathname
    .split("/")
    .pop()
    .replace(/\.html$/, "");
  const navLinks = document.querySelectorAll(".nav_position a");
  const legalLinks = document.querySelectorAll(".legal_and_policy_position a");
  updateActiveLinks(navLinks, currentPath);
  updateActiveLinks(legalLinks, currentPath);
}

function updateActiveLinks(links, currentPath) {
  links.forEach((link) => {
    const linkPath = link
      .getAttribute("href")
      .split("/")
      .pop()
      .replace(/\.html$/, "");
    const parent = link.closest("div");
    if (currentPath === linkPath) {
      parent.classList.add("active_background_color");
    } else {
      parent.classList.remove("active_background_color");
    }
  });
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

function addLegalAndPolicyClickListeners() {
  const containers = document.querySelectorAll(".privacy_policy_login, .legal_notice_login");
  containers.forEach((container) => {
    container.addEventListener("click", function () {
      const link = container.querySelector("a");
      if (link) {
        window.location.href = link.getAttribute("href");
      }
    });
  });
}
