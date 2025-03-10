/**
 * Verifies if the current user is authorized to access protected pages.
 * Checks localStorage for either "isGuest" or "userId" values.
 * If neither exists, redirects the user to the login page.
 *
 * @returns {void}
 */
function checkUser() {
  const isGuest = localStorage.getItem("isGuest");
  const userId = localStorage.getItem("userId");
  if (isGuest === "true" || userId) {
    return;
  }
  window.location.replace("index.html");
}

/**
 * Logs out the current user by clearing their authentication data.
 * Removes userId and isGuest status from localStorage, redirects to login page,
 * and prevents back navigation to authenticated pages after logout.
 *
 * @returns {void}
 */
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("isGuest");
  window.location.replace("index.html");
  if (window.history && window.history.pushState) {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }
}
