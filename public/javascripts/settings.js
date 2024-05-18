document.addEventListener("DOMContentLoaded", () => {
  let sets = document.querySelectorAll(".sets");
  let profileForm = document.querySelector(".profileForm");
  let passwordForm = document.querySelector(".passwordForm");
  let deleteForm = document.querySelector(".deleteForm");

  sets.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      console.log(e.target.classList);
      document.querySelector(
        "#heading"
      ).innerHTML = `Settings / ${e.target.innerText}`;
      if (e.target.innerText === "Change Password") {
        profileForm.style.zIndex = "1";
        deleteForm.style.zIndex = "2";
        passwordForm.style.zIndex = "3";
      } else if (e.target.innerText === "Delete Account") {
        passwordForm.style.zIndex = "1";
        profileForm.style.zIndex = "2";
        deleteForm.style.zIndex = "3";
      } else {
        deleteForm.style.zIndex = "1";
        passwordForm.style.zIndex = "2";
        profileForm.style.zIndex = "3";
      }
    });
  });

  // ------------------------------------------------------
  let listItems = document.querySelectorAll(".listitems");
  let closeBtns = document.querySelectorAll(".closeBtn");

  listItems.forEach((itm, idx) => {
    itm.addEventListener("click", (elm) => {
      document.querySelector(
        "#heading2"
      ).innerHTML = `Settings / ${elm.target.innerText}`;
      if (idx === 0) {
        profileForm.style.opacity = "1";
        profileForm.style.pointerEvents = "initial";
      } else if (idx === 1) {
        passwordForm.style.opacity = "1";
        passwordForm.style.pointerEvents = "initial";
      } else {
        deleteForm.style.opacity = "1";
        deleteForm.style.pointerEvents = "initial";
      }
    });
  });

  closeBtns.forEach((itm, idx) => {
    itm.addEventListener("click", (elm) => {
      document.querySelector("#heading2").innerHTML = `Settings`;
      if (idx === 0) {
        profileForm.style.opacity = "0";
        profileForm.style.pointerEvents = "none";
      } else if (idx === 1) {
        passwordForm.style.opacity = "0";
        passwordForm.style.pointerEvents = "none";
      } else {
        deleteForm.style.opacity = "0";
        deleteForm.style.pointerEvents = "none";
      }
    });
  });

  // -----------------------------------------------------------------

  const sideBar = document.querySelector("#sideBar");

  if (window.innerWidth < 500) {
    sideBar.style.display = "none";
  }

  // -----------------------------------------------------------------
  document.getElementById("mobileNumber").addEventListener("input", (e) => {
    e.target.setCustomValidity(
      e.target.value.match(/^\d{10}$/) ? "" : "Please enter a 10-digit number"
    );
  });

  // -----------------------------------------------------------------
  let icon = document.querySelectorAll("#eye");
  let input = document.querySelectorAll(".inputField > input");
  let flg = 0;

  if (icon && input) {
    icon.forEach((itm) => {
      itm.addEventListener("click", () => {
        const actions = ["ri-eye-line", "ri-eye-off-line"];

        itm.classList.toggle(actions[flg], true);
        itm.classList.toggle(actions[1 - flg], false);

        input.forEach((inp) => {
          inp.setAttribute("type", flg ? "text" : "password");
        });
        flg ^= 1;
      });
    });
  } else {
    console.error("Required elements not found");
  }

  // --------------------- Get OTP ---------------------
  // Selecting DOM elements
  const checkBtn = document.querySelector("#check");
  const delete_Form = document.querySelector("#delete_Form");
  const afterOtp = document.querySelector("#afterOtp");
  const inputDiv = deleteForm.children[1].children[2].children[0];

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
    checkBtn.style.backgroundColor = loading ? "transparent" : "#76d6ca";
    checkBtn.innerHTML = loading
      ? `<img src="/images/loader2.gif" alt="">`
      : "OTP Sent";
  }

  // Function to update form and button after successful request
  function updateFormAndButton() {
    inputDiv.readOnly = true;
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
    } else if (error.response && error.response.status === 410) {
      alert("OTP Expired!");
    } else if (error.response && error.response.status === 401) {
      alert("You have entered wrong password!");
    } else {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  }

  // Function to handle button click
  async function handleClick() {
    const inputValue = inputDiv.value.trim();
    if (!inputValue) return alert("Please enter your email or username");

    try {
      setButtonStyle(true);
      const { status } = await axios.post("/checkUser/deleteAccount", {
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
  inputDiv.addEventListener("input", () => {
    checkBtn.style.backgroundColor = "var(--btnColor)";
    // Remove the existing click event listener
    checkBtn.removeEventListener("click", handleClick);
    // Re-attach the click event listener with { once: true }
    attachClickListener();
  });
});
