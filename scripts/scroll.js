/**
 * Horizontal Scrolling Implementation
 *
 * This script enables drag-to-scroll functionality for board columns,
 * allowing users to horizontally scroll content by clicking and dragging.
 */
document.querySelectorAll("#toDo, #progress, #feedback, #done").forEach((section) => {
  /** @type {boolean} Tracks if mouse is currently pressed down */
  let isDown = false;
  /** @type {number} Starting X position when drag begins */
  let startX;
  /** @type {number} Initial scroll position when drag begins */
  let scrollLeft;

  /**
   * Initiates the dragging action on mouse down
   * @param {MouseEvent} e - The mouse down event
   */
  section.addEventListener("mousedown", (e) => {
    isDown = true;
    section.classList.add("grabbing");
    startX = e.pageX - section.offsetLeft;
    scrollLeft = section.scrollLeft;
  });

  /**
   * Cancels dragging when mouse leaves the section
   */
  section.addEventListener("mouseleave", () => {
    isDown = false;
    section.classList.remove("grabbing");
  });

  /**
   * Ends dragging when mouse button is released
   */
  section.addEventListener("mouseup", () => {
    isDown = false;
    section.classList.remove("grabbing");
  });

  /**
   * Calculates and applies horizontal scrolling during drag
   * @param {MouseEvent} e - The mouse move event
   */
  section.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    // Only apply horizontal scrolling if movement is primarily horizontal
    if (Math.abs(e.movementX) > Math.abs(e.movementY)) {
      e.preventDefault();
      const x = e.pageX - section.offsetLeft;
      // Apply a multiplier for smoother scrolling feel
      const walk = (x - startX) * 1.5;
      section.scrollLeft = scrollLeft - walk;
    }
  });
});
