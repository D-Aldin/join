/**
 * Handles device orientation changes for mobile devices
 * Adds 'landscape' class to body when device is in landscape mode and width is less than 780px
 * Removes the class when in portrait mode or on larger screens
 * This allows for CSS to display appropriate messages or layout changes
 */
function handleOrientation() {
  if (window.innerWidth < 780 && window.matchMedia("(orientation: landscape)").matches) {
    document.body.classList.add("landscape");
  } else {
    document.body.classList.remove("landscape");
  }
}

/**
 * Event listeners to detect changes in orientation
 * - 'load': Ensures correct display state on initial page load
 * - 'resize': Detects changes in viewport dimensions
 * - 'orientationchange': Specific event for device rotation
 */
window.addEventListener("load", handleOrientation);
window.addEventListener("resize", handleOrientation);
window.addEventListener("orientationchange", handleOrientation);
