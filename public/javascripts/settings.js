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
  const getOTP = document.querySelectorAll("#otp");
  let show_response = document.querySelector("#response");
  let mailData;

  getOTP.forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        let { data } = await axios.get("http://localhost:3000/sendmail");
        console.log(data);
        mailData = data;
        if (data.success) {
          show_response.style.display = "initial";
          show_response.innerText = data.message;
        } else {
          // Throw error if status is not handled
          alert("Something went wrong!");
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    });
  });

  passwordForm.children[1].addEventListener("submit", (e) => {
    if (!mailData) {
      e.preventDefault();
      console.log(e);
      alert("Please Get a valid OTP");
    }
  });

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
});
