// let backBtn = document.querySelector('#commentCrossBtn');
// backBtn.addEventListener('click', () => {
//   history.back()
// })

let optionBtn = document.querySelector(".options");
let optionBox = document.querySelector("#optionDiv");
let cancelBtn = document.querySelector("#cancelBtn");

optionBtn.addEventListener("click", () => {
  optionBox.style.opacity = "1";
  optionBox.style.pointerEvents = "initial";
});

cancelBtn.addEventListener("click", () => {
  optionBox.style.opacity = "0";
  optionBox.style.pointerEvents = "none";
});

const showComment = document.querySelector(".showComment");
function scrollToBottom() {
  showComment.scrollTop = showComment.scrollHeight;
}

window.addEventListener("load", () => {
  scrollToBottom();
});

let commentBtn = document.querySelector("#commentBtn");

console.log(window.innerWidth)

if (window.innerWidth > 500) {
  if (commentBtn) {
    commentBtn.innerHTML = "Post";
  }
} else {
  if (commentBtn) {
    commentBtn.innerHTML = `<ion-icon name="send"></ion-icon>`;
  }
}
