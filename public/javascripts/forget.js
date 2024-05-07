// Selecting DOM elements
const checkBtn = document.querySelector("#check");
const forgetForm = document.querySelector("#forgetForm");
const afterOtp = document.querySelector("#afterOtp");

// Adding click event listener to the check button
checkBtn.addEventListener(
  "click",
  async () => {
    // Get the value of the input field and trim whitespace
    const inputValue = forgetForm.children[1].value.trim();
    // Check if the input value is empty
    if (!inputValue) return alert("Please enter your email or username");

    try {
      // Modify button style to indicate loading
      setButtonStyle(true);
      // Send a POST request to check user status
      const { status } = await axios.post("/checkUser", {
        credentials: inputValue,
      });
      // Handle different response statuses
      if ([200, 250].includes(status)) {
        alert("OTP sent successfully.");
        // Update form and button after successful request
        updateFormAndButton();
      } else if (status === 204) {
        alert("User not found with provided username or email");
      } else if (status === 409) {
        alert("An OTP has already been sent to this email or username.");
        // Update form and button after OTP is already sent
        updateFormAndButton();
      } else {
        // Throw error if status is not handled
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      // Handle errors during request
      handleErrorResponse(error);
    } finally {
      // Reset button style after request completion
      setButtonStyle(false);
    }
  },
  { once: true }
); // Make sure the event listener is triggered only once

// Function to modify button style based on loading status
function setButtonStyle(loading) {
  // Set button size and padding based on loading status and window width
  checkBtn.style.height = loading
    ? window.innerWidth <= 500
      ? "15vmax"
      : "10vmax"
    : window.innerWidth <= 500
    ? "5vmax"
    : "initial";
  checkBtn.style.width = loading
    ? window.innerWidth <= 500
      ? "15vmax"
      : "10vmax"
    : window.innerWidth <= 500
    ? "15vmax"
    : "initial";
  checkBtn.style.padding = loading
    ? window.innerWidth <= 500
      ? "0"
      : "0"
    : window.innerWidth <= 500
    ? "0"
    : "0.8vmax 2.4vmax";
  // Set button background color and content based on loading status
  checkBtn.style.backgroundColor = loading ? "transparent" : "var(--btnColor)";
  checkBtn.innerHTML = loading
    ? `<img src="/images/loader2.gif" alt="">`
    : "Check";
}

// Function to update form and button after successful request
function updateFormAndButton() {
  forgetForm.children[1].readOnly = true;
  afterOtp.style.display = "flex";
}

// Function to handle errors during request
function handleErrorResponse(error) {
  // Check if the error response status is 409 (Conflict)
  if (error.response && error.response.status === 409) {
    alert("An OTP has already been sent to this email or username.");
    // Update form and button after OTP is already sent
    updateFormAndButton();
  } else {
    // Log the error to console and show a generic error message
    console.error("Error:", error);
    alert("Something went wrong!");
  }
}
