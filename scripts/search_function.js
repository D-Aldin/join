/**
 * The search input field element.
 * @type {HTMLInputElement}
 */
const searchFiled = document.querySelector("#searchbar");

/**
 * The element that displays the "No task found" message.
 * @type {HTMLElement}
 */
const refMessage = document.querySelector(".no_found");

/**
 * An array to hold task objects, each containing the card element, title, and description.
 * @type {Array<{card: HTMLElement, title: string, description: string}>}
 */
const listOfTasks = [];

/**
 * Counter for tracking the number of tasks that do not match the search criteria.
 * @type {number}
 */
let statusCounter = 0;

/**
 * Collects all task cards from the DOM and stores their relevant data into the listOfTasks array.
 *
 * Each task object contains:
 * - card: The HTML element for the task.
 * - title: The task title (retrieved from the second child element of the article).
 * - description: The task description (retrieved from the third child element of the article).
 *
 * @returns {Array<{card: HTMLElement, title: string, description: string}>} The array of task objects.
 */
function collectTasks() {
  const cards = document.querySelectorAll("article");
  cards.forEach((element) => {
    let card = element;
    let title = element.firstElementChild.nextElementSibling.innerText;
    let description = element.firstElementChild.nextElementSibling.nextElementSibling.innerText;
    listOfTasks.push({ card, title, description });
  });

  return listOfTasks;
}

/**
 * Sets up the search functionality by adding an input event listener to the search field.
 *
 * When the user types into the search field, it:
 * - Converts the user input to lowercase for case-insensitive comparison
 * - Iterates over all tasks in listOfTasks
 * - Checks if the task title contains the search text
 * - Toggles the "hide" class on each task card to control visibility
 * - Increments statusCounter for tasks that don't match search criteria
 * - Calls noTaskFound() to manage the "no tasks found" message visibility
 * - Hides the "no tasks found" message if the search field is empty
 *
 * This function is called once during initialization to establish the search behavior.
 */
function searchFunk() {
  searchFiled.addEventListener("input", function () {
    let userInput = searchFiled.value.toLowerCase();
    statusCounter = 0;
    listOfTasks.forEach((element) => {
      let isVisible = element.title.toLowerCase().includes(userInput) || element.description.toLowerCase().includes(userInput);
      element.card.classList.toggle("hide", !isVisible);
      if (!isVisible) {
        statusCounter += 1;
      }
    });
    noTaskFound(listOfTasks, statusCounter);
    if (searchFiled.value == "") {
      refMessage.classList.add("d_none");
    }
  });
}

/**
 * Controls the visibility and animation of the "No task found" message.
 *
 * This function compares the total number of tasks with the number of hidden tasks:
 * - When all tasks are hidden: Displays the message with a slide-in animation from right
 * - When some tasks are visible: Hides the message with a slide-out animation to right
 *   and adds the d_none class after animation completes
 *
 * @param {Array<{card: HTMLElement, title: string, description: string}>} list - The array of task objects
 * @param {number} counter - The number of tasks that did not match the search criteria
 */
function noTaskFound(list, counter) {
  if (list.length === counter) {
    refMessage.classList.remove("msg_d_none");
    refMessage.style.animation = "slideInFromRight 125ms ease forwards";
  } else {
    refMessage.style.animation = "slideOutToRight 125ms ease forwards";
    setTimeout(() => {
      refMessage.classList.add("msg_d_none");
    }, 125);
  }
}

/**
 * Initializes the application when the DOM content is fully loaded.
 *
 * It sets a timeout to collect the tasks after 500ms (allowing the DOM to render fully)
 * and initializes the search functionality.
 */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(collectTasks, 500);
  searchFunk();
});
