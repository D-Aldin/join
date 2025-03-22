/**
 * Sets up event listeners for drag and drop operations on all drop zones.
 * Clears any existing listeners before adding new ones to prevent duplicates.
 *
 * @param {DragEvent} dragEvent - The initial drag event that triggered this setup
 */
function initializeDropZoneHighlights(dragEvent) {
  dropZones.forEach((zone) => {
    removeDropZoneListeners(zone);
    addDropZoneListeners(zone);
  });
}

function removeDropZoneListeners(zone) {
  zone.removeEventListener("dragenter", handleDragEnter);
  zone.removeEventListener("dragleave", handleDragLeave);
  zone.removeEventListener("dragover", handleDragOver);
  zone.removeEventListener("drop", dropPoint);
}

function addDropZoneListeners(zone) {
  zone.addEventListener("dragenter", handleDragEnter);
  zone.addEventListener("dragleave", handleDragLeave);
  zone.addEventListener("dragover", handleDragOver);
  zone.addEventListener("drop", dropPoint);
}

/**
 * Handles the dragenter event when a card is dragged over a section.
 * Adds visual highlighting to indicate a valid drop zone.
 *
 * @param {DragEvent} event - The dragenter event object
 */
function handleDragEnter(event) {
  const section = event.currentTarget;
  if (isEventInsideSection(section, event)) return;
  highlightSection(section);
  addHighlightBox(section);
}

function isEventInsideSection(section, event) {
  return (section.contains(document.getElementById(cardID)) && !event.relatedTarget) || section.contains(event.relatedTarget);
}

function highlightSection(section) {
  section.classList.add("section-highlight");
}

function addHighlightBox(section) {
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
  const targetCard = event.target.closest("card");
  if (!targetCard) return;
  insertHighlightBox(event, targetCard);
}

function insertHighlightBox(event, targetCard) {
  const cardRect = targetCard.getBoundingClientRect();
  const mouseY = event.clientY;
  const isAboveMiddle = mouseY < cardRect.top + cardRect.height / 2;
  const box = document.createElement("div");
  box.classList.add("highlight_box", "insertion-point");
  box.style.height = "10px";
  if (isAboveMiddle) {
    targetCard.parentNode.insertBefore(box, targetCard);
  } else {
    targetCard.parentNode.insertBefore(box, targetCard.nextSibling || null);
  }
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
  if (event.target.classList.contains("insertion-point")) {
    return handleInsertionPoint(event.target);
  } else if (event.target.classList.contains("card")) {
    return handleCardDrop(event);
  } else if (event.target.classList.contains("highlight_box")) {
    return { targetSection: event.target.closest("section"), insertionPoint: null };
  }
  return handleContainerDrop(event.target);
}

function handleInsertionPoint(target) {
  return { targetSection: target.closest("section"), insertionPoint: target };
}

function handleCardDrop(event) {
  const targetCard = event.target;
  const targetSection = targetCard.closest("section");
  const cardRect = targetCard.getBoundingClientRect();
  const insertionPoint = event.clientY < cardRect.top + cardRect.height / 2 ? targetCard : targetCard.nextSibling;
  return { targetSection, insertionPoint };
}

function handleContainerDrop(target) {
  const container = target.closest("#toDo, #progress, #feedback, #done");
  return { targetSection: container ? container.closest("section") : null, insertionPoint: null };
}
