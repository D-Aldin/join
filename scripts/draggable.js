function draggedElementID(event) {
  const elementID = event.target;
  console.log(elementID.id);
}

function dropPoint(event) {
  const category = event.target.parentElement;
  console.log(category.id);
}

function allowDrop() {
  event.preventDefault();
}
