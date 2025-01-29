function overlayOn(event) {
  const category = event.target;
  console.log(category);

  document.getElementById("overlay").style.display = "block";
  document.getElementById("box").innerHTML = HTMLForOpenCard();
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

function stopEventBubbel(event) {
  event.stopPropagation();
}

function getData(event) {}
