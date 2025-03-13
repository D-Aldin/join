/**
 * Sets up validation parameters for contact inputs
 * @param {string} name - Contact name
 * @param {string} email - Contact email
 * @param {string} phone - Contact phone number
 * @param {string} prefix - Input field ID prefix ('add_' or 'edit_')
 * @returns {Object} Object containing inputs, inputIds and error messages
 */
function setupValidationParams(name, email, phone, prefix = "add_") {
  const inputs = { name, email, phone };
  const inputIds = {
    name: `${prefix}name`,
    email: `${prefix}email`,
    phone: `${prefix}phone`,
  };
  const errors = {
    name: "Please enter your first and last name here.",
    email: "Please enter your email address here.",
    phone: "Please enter your phone number here.",
  };
  return { inputs, inputIds, errors };
}

/**
 * Validates contact input fields and displays appropriate error messages
 * @param {string} name - Contact name
 * @param {string} email - Contact email
 * @param {string} phone - Contact phone number
 * @param {string} prefix - Input field ID prefix ('add_' or 'edit_')
 * @returns {boolean} True if validation failed, false otherwise
 */
function validateContactInputs(name, email, phone, prefix = "add_") {
  const { inputs, inputIds, errors } = setupValidationParams(name, email, phone, prefix);
  let hasError = false;
  for (const key in inputs) {
    const fieldError = statusOfInputFields(key, inputs, inputIds, errors, prefix);
    if (fieldError) {
      hasError = true;
    }
  }
  return hasError;
}

/**
 * Validates and updates a contact if validation passes
 * @param {string} id - Contact ID
 * @returns {boolean} False to prevent form submission
 */
function validateAndUpdateContact(id) {
  let name = document.getElementById("edit_name").value;
  let email = document.getElementById("edit_email").value;
  let phone = document.getElementById("edit_phone").value;
  if (validateContactInputs(name, email, phone, "edit_")) {
    return false;
  }
  updateContactInDataBase(id);
  setTimeoutSuccessfullyOverlayEdit();
  return false;
}

/**
 * Checks status of input fields and displays errors if needed
 * @param {string} key - Field key (name, email, phone)
 * @param {Object} inputs - Object containing all input values
 * @param {Object} inputIds - Object mapping keys to DOM element IDs
 * @param {Object} errors - Object mapping keys to error messages
 * @param {string} prefix - Input field ID prefix ('add_' or 'edit_')
 * @returns {boolean} True if the field has an error
 */
function statusOfInputFields(key, inputs, inputIds, errors, prefix = "add_") {
  const value = inputs[key];
  const inputElement = document.getElementById(inputIds[key]);
  let fieldHasError = false;
  const errorId = prefix === "edit_" ? `edit_${key}_error` : `${key}_error`;
  const errorElement = document.getElementById(errorId);
  if (!value) {
    errorElement.innerText = errors[key];
    inputElement.style.borderColor = "red";
    fieldHasError = true;
  } else {
    errorElement.innerText = "";
    inputElement.style.borderColor = "";
  }
  return fieldHasError;
}

/**
 * Event listener that clears error messages when clicking outside the form
 * Improves user experience by automatically dismissing validation errors
 * when the user interacts elsewhere on the page
 */
document.addEventListener("click", function (event) {
  if (!document.querySelector(".form_input_fields_position").contains(event.target)) {
    clearErrorMessages();
  }
});

/**
 * Sets up event listeners for UI elements that should clear error messages
 * Connects the cancel button and close icon to the clearErrorMessages function
 */
document.querySelector(".btn_cancel").addEventListener("click", clearErrorMessages);
document.querySelector(".overlay_close_btn_position img").addEventListener("click", clearErrorMessages);

/**
 * Clears all validation error messages and resets input field styling for both add and edit contact forms
 * Prepares arrays of element IDs and delegates the actual DOM manipulation to queryOfClearErrorMessage
 * @returns {void}
 */
function clearErrorMessages() {
  const addErrorIds = ["name_error", "email_error", "phone_error"];
  const addInputIds = ["add_name", "add_email", "add_phone"];
  const editErrorIds = ["edit_name_error", "edit_email_error", "edit_phone_error"];
  const editInputIds = ["edit_name", "edit_email", "edit_phone"];
  queryOfClearErrorMessage(addErrorIds, addInputIds, editErrorIds, editInputIds);
}

/**
 * Performs DOM manipulations to clear all validation error messages and reset input field styling
 * Processes both add contact form and edit contact form elements
 * @param {string[]} addErrorIds - Array of error message element IDs for add form
 * @param {string[]} addInputIds - Array of input field element IDs for add form
 * @param {string[]} editErrorIds - Array of error message element IDs for edit form
 * @param {string[]} editInputIds - Array of input field element IDs for edit form
 * @returns {void}
 */
function queryOfClearErrorMessage(addErrorIds, addInputIds, editErrorIds, editInputIds) {
  for (let i = 0; i < addErrorIds.length; i++) {
    const element = document.getElementById(addErrorIds[i]);
    if (element) element.innerText = "";
  }
  for (let i = 0; i < editErrorIds.length; i++) {
    const element = document.getElementById(editErrorIds[i]);
    if (element) element.innerText = "";
  }
  for (let i = 0; i < addInputIds.length; i++) {
    const element = document.getElementById(addInputIds[i]);
    if (element) element.style.borderColor = "";
  }
  for (let i = 0; i < editInputIds.length; i++) {
    const element = document.getElementById(editInputIds[i]);
    if (element) element.style.borderColor = "";
  }
}
