// Selecting DOM elements
const checkBtn = document.querySelector("#check");
const forgetForm = document.querySelector("#forgetForm");
const afterOtp = document.querySelector("#afterOtp");

// Function to modify button style based on loading status
function setButtonStyle(loading) {
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
    ? "0"
    : window.innerWidth <= 500
    ? "0"
    : "0.8vmax 2.4vmax";
  // Set button background color and content based on loading status
  checkBtn.style.backgroundColor = loading ? "transparent" : "#76d6ca";
  checkBtn.innerHTML = loading
    ? `<img src="/images/loader2.gif" alt="">`
    : "OTP Sent";
}

// Function to update form and button after successful request
function updateFormAndButton() {
  forgetForm.children[1].readOnly = true;
  afterOtp.style.display = "flex";
}

// Function to handle errors during request
function handleErrorResponse(error) {
  if (
    (error.response && error.response.status === 409) ||
    error.response.status === 400
  ) {
    alert("An OTP has already been sent to this email or username.");
    updateFormAndButton();
  } else if (error.response && error.response.status === 204) {
    alert("User not found with provided username or email");
    updateFormAndButton();
  } else if (error.response && error.response.status === 410) {
    alert("OTP Expired!");
    updateFormAndButton();
  } else {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
}

// Function to handle button click
async function handleClick() {
  const inputValue = forgetForm.children[1].value.trim();
  if (!inputValue) return alert("Please enter your email or username");

  try {
    setButtonStyle(true);
    const { status } = await axios.post("/checkUser/forgetForm", {
      credentials: inputValue,
    });

    if ([200, 250].includes(status)) {
      alert("OTP sent successfully.");
      updateFormAndButton();
    } else if (status === 204) {
      alert("User not found with provided username or email");
    } else if (status === 409) {
      alert("An OTP has already been sent to this email or username.");
      updateFormAndButton();
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    handleErrorResponse(error);
  } finally {
    setButtonStyle(false);
  }
}

// Function to attach the click event listener with { once: true }
function attachClickListener() {
  checkBtn.addEventListener("click", handleClick, { once: true });
}

// Initial attachment of click event listener
attachClickListener();

// Add input event listener to reset the click event listener
forgetForm.children[1].addEventListener("input", () => {
  checkBtn.style.backgroundColor = "var(--btnColor)";
  // Remove the existing click event listener
  checkBtn.removeEventListener("click", handleClick);
  // Re-attach the click event listener with { once: true }
  attachClickListener();
});
