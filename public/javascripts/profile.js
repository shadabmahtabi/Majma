const editBtn = document.querySelector("#editBtn");
const editBtn2 = document.querySelector("#editBtn2");

// ------------------------- Edit profile details  -------------------------

if (window.innerWidth > 500) {
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      // console.log('click');
      document.querySelector("#editBox").style.opacity = 1;
      document.querySelector("#editBox").style.pointerEvents = "initial";
    });
  }

  document.querySelector("#crossBtn").addEventListener("click", () => {
    // console.log('click');
    document.querySelector("#editBox").style.pointerEvents = "none";
    document.querySelector("#editBox").style.opacity = 0;
  });
} else {
  if (editBtn2) {
    editBtn2.addEventListener("click", () => {
      // console.log('click');
      document.querySelector("#editBox").style.opacity = 1;
      document.querySelector("#editBox").style.pointerEvents = "initial";
    });
  }

  document.querySelector("#crossBtn").addEventListener("click", () => {
    // console.log('click');
    document.querySelector("#editBox").style.pointerEvents = "none";
    document.querySelector("#editBox").style.opacity = 0;
  });
}

//  ------------------------- Edit profile picture  -------------------------

let editProfileDiv = document.querySelector("#editProfileDiv");
let editProfileDiv2 = document.querySelector("#editProfileDiv2");

if (window.innerWidth > 500) {
  if (editProfileDiv) {
    editProfileDiv.addEventListener("click", () => {
      document.querySelector("#editProfileBox").style.opacity = 1;
      document.querySelector("#editProfileBox").style.pointerEvents = "initial";
    });
    
    document.querySelector("#closeProfileBtn").addEventListener("click", () => {
      document.querySelector("#editProfileBox").style.pointerEvents = "none";
      document.querySelector("#editProfileBox").style.opacity = 0;
    });
  }
} else {
  if (editProfileDiv2) {
    editProfileDiv2.addEventListener("click", () => {
      document.querySelector("#editProfileBox").style.opacity = 1;
      document.querySelector("#editProfileBox").style.pointerEvents = "initial";
    });
    
    document.querySelector("#closeProfileBtn").addEventListener("click", () => {
      document.querySelector("#editProfileBox").style.pointerEvents = "none";
      document.querySelector("#editProfileBox").style.opacity = 0;
    });
  }
}

document.querySelector("#editProfilePic").addEventListener("click", () => {
  document.querySelector("#imgInput").click();
});

document.querySelector("#imgInput").addEventListener("change", (e) => {
  document
    .querySelector("img.pImg")
    .setAttribute("src", URL.createObjectURL(e.target.files[0]));
});

//  ------------------------- upload picture  -------------------------
// document.querySelector('#upload').addEventListener('click', ()=>{
//     console.log('click');
//     document.querySelector('#uploadBox').style.opacity = 1;
//     document.querySelector('#uploadBox').style.pointerEvents = 'initial';
// })

// document.querySelector('#uploadCrossBtn').addEventListener('click', () => {
//     // console.log('click');
//     document.querySelector('#uploadBox').style.pointerEvents = 'none';
//     document.querySelector('#uploadBox').style.opacity = 0;
// })

// document.querySelector('#btn').addEventListener('click', () => {
//     document.querySelector('#input').click();
//     if (document.querySelector('#input').value) {
//         document.querySelector('.imgName').innerHTML = document.querySelector('#input').value;
//     }
// })

document.querySelectorAll(".parts").forEach((part) => {
  part.addEventListener("click", (dets) => {
    document.querySelector("#showFollowBox").style.opacity = 1;
    document.querySelector("#showFollowBox").style.pointerEvents = "initial";
  });
});

document.querySelector("#closeFollowBtn").addEventListener("click", (dets) => {
  // console.log("click");
  document.querySelector("#showFollowBox").style.opacity = 0;
  document.querySelector("#showFollowBox").style.pointerEvents = "none";
});

$(".showF").click(function () {
  $(this).addClass("active").siblings().removeClass("active");
});

let following = document.querySelector("#following");
let followers = document.querySelector("#followers");

document.querySelectorAll(".showF").forEach((itm) => {
  itm.addEventListener("click", (e) => {
    if (e.target.innerHTML.toLowerCase() === "followers") {
      following.style.left = "-100%";
      followers.style.left = "0";
    } else {
      followers.style.left = "100%";
      following.style.left = "0";
    }
  });
});
