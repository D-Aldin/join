let card;
let refCardBox = document.getElementById("box");

function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

function stopEventBubbel(event) {
  event.stopPropagation();
}

async function getData(event) {
  let id = event.currentTarget.id;
  const fetchDetails = await fetchCardDetails("tasks", id);
  const refersToCard = fetchDetails[id];
  // console.log(refersToCard);
  refCardBox.innerHTML = HTMLForOpenCard(refersToCard.category, refersToCard.title, refersToCard.description, refersToCard.data, refersToCard.prio);
  managenProfilesWhenCardOpen(id);
  managenSubtasks(id);
}

async function fetchCardDetails(path = "", id) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "GET",
  });
  let responseToJSON = response.json();
  let result = await responseToJSON;
  return result;
}

async function managenProfilesWhenCardOpen(id) {
  const dataFromFireBase = await fetchCardDetails("tasks", id);
  const refAssignedObject = dataFromFireBase[id].assigned;
  let refProfileContainer = document.querySelector(".profiles");
  console.log(refProfileContainer);

  for (const key in refAssignedObject) {
    if (Object.prototype.hasOwnProperty.call(refAssignedObject, key)) {
      const name = initials(refAssignedObject[key]);
      const color = key;
      refProfileContainer.innerHTML += contactTamplateForOpenCard(name, color);
    }
  }
}

async function managenSubtasks(id) {
  let dataFromFireBase = await fetchCardDetails("tasks", id);
  const refSubtasks = dataFromFireBase[id].subtask;
  for (const key in refSubtasks) {
    if (Object.prototype.hasOwnProperty.call(refSubtasks, key)) {
      const element = refSubtasks[key];
      console.log(element);
    }
  }
}
