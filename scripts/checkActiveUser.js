function checkUser() {
  const isGuest = localStorage.getItem("isGuest");
  const userId = localStorage.getItem("userId");

  if (isGuest === "true" || userId) {
    // Wenn der Benutzer ein Gast ist ODER ein regulärer Benutzer eingeloggt ist
    return; // Keine Weiterleitung zur Login-Seite
  }

  // Wenn weder Gast noch regulärer Benutzer eingeloggt ist
  window.location.replace("../login.html"); // Weiterleitung zur Login-Seite
}

function logout() {
  localStorage.removeItem("userId"); // userId entfernen
  localStorage.removeItem("isGuest"); // Gaststatus entfernen
  window.location.replace("../login.html"); // Zur Login-Seite weiterleiten

  // History-API: Die aktuelle Seite aus der History entfernen
  if (window.history && window.history.pushState) {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }
}
