/**
 * Sets up event listeners for task buttons.
 */
document.querySelector("#addToDo").addEventListener("click", function () {
  showOverlay();
  renderAddTaskMenu();
});

/**
 * Sets up event listeners for task buttons.
 */
document.querySelector("#addProgress").addEventListener("click", function () {
  showOverlay();
  renderAddTaskMenu();
  taskStatus = "progress";
});

/**
 * Sets up event listeners for task buttons.
 */
document.querySelector("#addFeedback").addEventListener("click", function () {
  showOverlay();
  renderAddTaskMenu();
  taskStatus = "feedback";
});

/**
 * Redirects to add_task.html if the window is resized below a threshold.
 */
window.addEventListener("resize", () => {
  const refOverlay = document.querySelector("#overlayForAddTask");
  if (window.innerWidth < 1301 && refOverlay.style.display === "block") {
    window.location = "add_task.html";
  }
});

/**
 * Sets an event listener to create a new subtask on pressing Enter.
 */
function setEventListenerForSubtask() {
  const refSubtaskInput = document.querySelector("#subtask");
  const inputFiled = document.querySelector("#subtask");
  refSubtaskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputFiled.value != "") {
        newSubtask();
      }
    }
  });
}
