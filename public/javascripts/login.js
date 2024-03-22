const sign_up_btn = document.querySelector('#signUp');
const hider = document.querySelector('#hider');

var flag = 0;
sign_up_btn.addEventListener('click', () => {
  if (flag === 0) {
    hider.style.transform = 'translate(-75%)'
    document.querySelector('#heading').innerHTML = "One of Us ?"
    document.querySelector('#text').innerHTML = "Click the Sign In button to login yourself"
    sign_up_btn.innerHTML = "Sign In"
    flag = 1;
  } else {
    hider.style.transform = 'translate(0)'
    document.querySelector('#heading').innerHTML = "New to Majma ?"
    document.querySelector('#text').innerHTML = "Click the Sign Up button to register yourself"
    sign_up_btn.innerHTML = "Sign Up"
    flag = 0;
  }
})