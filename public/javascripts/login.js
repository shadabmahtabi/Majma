const sign_up_btn = document.querySelector("#signUp");
const hider = document.querySelector("#hider");
const loginForm = document.querySelector(".loginForm");
const registerForm = document.querySelector(".registerForm");

var flag = 0;
sign_up_btn.addEventListener("click", () => {
  if (window.innerWidth > 500) {
    if (flag === 0) {
      hider.style.transform = "translate(-75%)";
      document.querySelector("#heading").innerHTML = "One of Us ?";
      document.querySelector("#text").innerHTML =
        "Click the Sign In button to login yourself";
      sign_up_btn.innerHTML = "Sign In";
      flag = 1;
    } else {
      hider.style.transform = "translate(0)";
      document.querySelector("#heading").innerHTML = "New to Majma ?";
      document.querySelector("#text").innerHTML =
        "Click the Sign Up button to register yourself";
      sign_up_btn.innerHTML = "Sign Up";
      flag = 0;
    }
  } else {
    console.log(window.innerWidth)
    if (flag === 0) {
      hider.style.transform = "translate(0)";
      hider.style.alignItems = "initial";
      document.querySelector("#heading").innerHTML = "One of Us ?";
      document.querySelector("#text").innerHTML =
      "Click the Sign In button to login yourself";
      sign_up_btn.innerHTML = "Sign In";
      loginForm.style.opacity = "0";
      loginForm.style.pointerEvents = "none";
      registerForm.style.opacity = "1";
      registerForm.style.pointerEvents = "initial";
      flag = 1;
    } else {
      hider.style.transform = "translate(0, -105%)";
      hider.style.alignItems = "flex-end";
      document.querySelector("#heading").innerHTML = "New to Majma ?";
      document.querySelector("#text").innerHTML =
      "Click the Sign Up button to register yourself";
      sign_up_btn.innerHTML = "Sign Up";
      registerForm.style.opacity = "0";
      registerForm.style.pointerEvents = "none";
      loginForm.style.opacity = "1";
      loginForm.style.pointerEvents = "initial";
      flag = 0;
    }
  }
});
