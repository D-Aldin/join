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

/**
 * Removes all drag and drop related event listeners from a drop zone.
 *
 * @param {HTMLElement} zone - The drop zone element to remove listeners from
 */
function removeDropZoneListeners(zone) {
  zone.removeEventListener("dragenter", handleDragEnter);
  zone.removeEventListener("dragleave", handleDragLeave);
  zone.removeEventListener("dragover", handleDragOver);
  zone.removeEventListener("drop", dropPoint);
}

/**
 * Adds all necessary drag and drop event listeners to a drop zone.
 *
 * @param {HTMLElement} zone - The drop zone element to add listeners to
 */
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

/**
 * Checks if the drag event is occurring within the same section.
 * This prevents highlighting when dragging within the same container.
 *
 * @param {HTMLElement} section - The section element to check
 * @param {DragEvent} event - The drag event
 * @returns {boolean} True if the event is inside the section, false otherwise
 */
function isEventInsideSection(section, event) {
  return (section.contains(document.getElementById(cardID)) && !event.relatedTarget) || section.contains(event.relatedTarget);
}

/**
 * Adds visual highlighting to a section by adding a CSS class.
 *
 * @param {HTMLElement} section - The section element to highlight
 */
function highlightSection(section) {
  section.classList.add("section-highlight");
}

/**
 * Creates and adds a highlight box to indicate a drop area within a section.
 * Removes any existing highlight boxes first to prevent duplicates.
 *
 * @param {HTMLElement} section - The section element to add highlight box to
 */
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

/**
 * Creates and positions a highlight box before or after a card based on mouse position.
 * The highlight box serves as a visual indicator for where the dragged card will be inserted.
 *
 * @param {DragEvent} event - The current drag event
 * @param {HTMLElement} targetCard - The card element that is being hovered over
 */
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

/**
 * Removes all UI elements related to drag and drop operations.
 * Includes removing highlight boxes and section highlights.
 */
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

/**
 * Processes a drop on an insertion point indicator.
 *
 * @param {HTMLElement} target - The insertion point element
 * @returns {Object} Object containing the target section and insertion point
 */
function handleInsertionPoint(target) {
  return { targetSection: target.closest("section"), insertionPoint: target };
}

/**
 * Processes a drop on a card element, determining whether to insert before or after.
 * Uses the mouse position relative to the card's midpoint to decide placement.
 *
 * @param {DragEvent} event - The drop event
 * @returns {Object} Object containing the target section and insertion point
 */
function handleCardDrop(event) {
  const targetCard = event.target;
  const targetSection = targetCard.closest("section");
  const cardRect = targetCard.getBoundingClientRect();
  const insertionPoint = event.clientY < cardRect.top + cardRect.height / 2 ? targetCard : targetCard.nextSibling;
  return { targetSection, insertionPoint };
}

/**
 * Processes a drop directly on a container rather than on a card or insertion point.
 *
 * @param {HTMLElement} target - The element where the drop occurred
 * @returns {Object} Object containing the target section and insertion point (null)
 */
function handleContainerDrop(target) {
  const container = target.closest("#toDo, #progress, #feedback, #done");
  return { targetSection: container ? container.closest("section") : null, insertionPoint: null };
}
