const BASE_URL = "https://dv-join-bbc2e-default-rtdb.europe-west1.firebasedatabase.app/";
let toDo = document.querySelector("#toDo");
let feedback = document.querySelector("#feedback");

function draggedElementID(event) {
  const elementID = event.target;
  console.log(elementID.id);
}

function dropPoint(event) {
  const category = event.target;
  console.log(category.id);
}

function allowDrop() {
  event.preventDefault();
}
