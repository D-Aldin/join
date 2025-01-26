let toDo = document.querySelector("#toDo");
let feedback = document.querySelector("#feedback");

function draggedElementID(event) {
  const elementID = event.target;
  console.log(elementID.id);

  event.target.addEventListener("dragstart", () => {
    event.target.classList.add("rotate");
  });

  event.target.addEventListener("dragend", () => {
    event.target.classList.remove("rotate");
  });
  event.dataTransfer.setData("text", event.target.id);
}

function dropPoint(event) {
  const category = event.target;
  console.log(category.id);
  let data = event.dataTransfer.getData("text");
  event.target.appendChild(document.getElementById(data));
}

function allowDrop() {
  event.preventDefault();
}
