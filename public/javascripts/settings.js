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
    document.querySelector(
      "#heading2"
    ).innerHTML = `Settings`;
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

const sideBar = document.querySelector("#sideBar");

if (window.innerWidth < 500) {
  sideBar.style.display = "none";
}
