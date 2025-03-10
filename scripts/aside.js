/**
 * Adds event listeners to the DOMContentLoaded event to initialize the page.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
  activeLink();
  addContainerClickListeners();
  addLegalAndPolicyClickListeners();
});

/**
 * Highlights the active link in the navigation and legal sections based on the current page.
 * @returns {void}
 */
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

/**
 * Updates the active link in the navigation and legal sections.
 * Adds the "active_background_color" class to the active link's parent.
 * @param {NodeList} links - A collection of link elements.
 * @param {string} currentPath - The current page path without the ".html" extension.
 * @returns {void}
 */
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

/**
 * Adds click event listeners to containers for navigation links.
 * Redirects to the link's href when clicked.
 * @returns {void}
 */
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

/**
 * Adds click event listeners to legal and policy containers.
 * Redirects to the link's href when clicked.
 * @returns {void}
 */
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
