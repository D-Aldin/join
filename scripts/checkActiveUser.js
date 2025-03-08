function checkUser() {
  const isGuest = localStorage.getItem("isGuest");
  const userId = localStorage.getItem("userId");
  if (isGuest === "true" || userId) {
    return;
  }
  window.location.replace("index.html");
}

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
