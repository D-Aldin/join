/**
 * Sets up event listeners for drag and drop operations on all drop zones.
 * Clears any existing listeners before adding new ones to prevent duplicates.
 *
 * @param {DragEvent} dragEvent - The initial drag event that triggered this setup
 */
function initializeDropZoneHighlights(dragEvent) {
  dropZones.forEach((zone) => {
    zone.removeEventListener("dragenter", handleDragEnter);
    zone.removeEventListener("dragleave", handleDragLeave);
    zone.removeEventListener("dragover", handleDragOver);
    zone.removeEventListener("drop", dropPoint);

    zone.addEventListener("dragenter", handleDragEnter);
    zone.addEventListener("dragleave", handleDragLeave);
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", dropPoint);
  });
}

/**
 * Handles the dragenter event when a card is dragged over a section.
 * Adds visual highlighting to indicate a valid drop zone.
 *
 * @param {DragEvent} event - The dragenter event object
 */
function handleDragEnter(event) {
  const section = event.currentTarget;
  if ((section.contains(document.getElementById(cardID)) && !event.relatedTarget) || section.contains(event.relatedTarget)) {
    return;
  }
  section.classList.add("section-highlight");
  section.querySelectorAll(".highlight_box").forEach((box) => box.remove());
  const targetContainer = section.querySelector("#toDo, #progress, #feedback, #done");
  if (targetContainer) {
    const box = document.createElement("div");
    box.classList.add("highlight_box");
    box.addEventListener("dragover", allowDrop);
    targetContainer.appendChild(box);
  }
}

/**
 * Handles the dragleave event when a card leaves a potential drop zone.
 * Removes highlighting if the dragged element has fully left the section.
 *
 * @param {DragEvent} event - The dragleave event object
 */
function handleDragLeave(event) {
  const section = event.currentTarget;
  if (!section.contains(event.relatedTarget)) {
    section.classList.remove("section-highlight");
    section.querySelectorAll(".highlight_box").forEach((box) => box.remove());
  }
}

/**
 * Processes dragover events to enable dropping and update visual indicators.
 * Prevents default behavior and sets the drag effect to "move".
 *
 * @param {DragEvent} event - The dragover event object
 */
function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  const section = event.currentTarget;
  const container = section.querySelector("#toDo, #progress, #feedback, #done");
  if (event.target.classList.contains("card") && event.target.id !== cardID) {
    adjustHighlightForCards(event, container);
  }
}

/**
 * Creates and positions highlight elements to indicate where a card will be inserted.
 * Places visual indicators above or below target cards based on mouse position.
 *
 * @param {DragEvent} event - The current drag event
 * @param {HTMLElement} container - The container element where cards are displayed
 */
function adjustHighlightForCards(event, container) {
  document.querySelectorAll(".highlight_box").forEach((box) => box.remove());
  const targetCard = event.target.closest(".card");
  if (!targetCard) return;
  const cardRect = targetCard.getBoundingClientRect();
  const mouseY = event.clientY;
  const isAboveMiddle = mouseY < cardRect.top + cardRect.height / 2;
  const box = document.createElement("div");
  box.classList.add("highlight_box", "insertion-point");
  box.style.height = "10px";
  if (isAboveMiddle) {
    targetCard.parentNode.insertBefore(box, targetCard);
  } else if (targetCard.nextSibling) {
    targetCard.parentNode.insertBefore(box, targetCard.nextSibling);
  } else {
    targetCard.parentNode.appendChild(box);
  }
}

/**
 * Highlights the drop point while dragging.
 * @param {Event} dragevent - The drag event.
 */
function highlightDropPoint(dragevent) {
  dropZones.forEach((zone) => {
    zone.addEventListener("dragenter", function () {
      if (!zone.contains(dragevent.target) && !zone.contains(document.querySelector(".highlight_box"))) {
        let box = document.createElement("div");
        box.classList.add("highlight_box");
        box.addEventListener("dragover", allowDrop);
        zone.lastElementChild.appendChild(box);
      }
    });
    zone.addEventListener("dragleave", function () {
      let refBox = document.querySelector(".highlight_box");
      if (refBox) refBox.remove();
    });
  });
}

function cleanupDropUI() {
  document.querySelectorAll(".highlight_box").forEach((box) => box.remove());
  document.querySelectorAll(".section-highlight").forEach((section) => section.classList.remove("section-highlight"));
}

/**
 * Determines the target section and insertion point for the dropped element.
 *
 * @param {DragEvent} event - The drop event
 * @returns {Object} Object containing targetSection and insertionPoint
 */
function determineDropTarget(event) {
  let targetSection = null;
  let insertionPoint = null;
  if (event.target.classList.contains("insertion-point")) {
    insertionPoint = event.target;
    targetSection = event.target.closest("section");
  } else if (event.target.classList.contains("card")) {
    const targetCard = event.target;
    targetSection = targetCard.closest("section");
    const cardRect = targetCard.getBoundingClientRect();
    const mouseY = event.clientY;
    if (mouseY < cardRect.top + cardRect.height / 2) {
      insertionPoint = targetCard;
    } else {
      insertionPoint = targetCard.nextSibling;
    }
  } else if (event.target.classList.contains("highlight_box")) {
    targetSection = event.target.closest("section");
    insertionPoint = null;
  } else {
    const container = event.target.closest("#toDo, #progress, #feedback, #done");
    if (container) {
      targetSection = container.closest("section");
      insertionPoint = null;
    }
  }
  return { targetSection, insertionPoint };
}
