document.addEventListener("DOMContentLoaded", () => {
  // const disableBackBtn = () => {
  //   window.history.forward();
  // };
  // disableBackBtn();
  // window.onload = disableBackBtn;
  // window.onpageshow = (event) => {
  //   if (event.persisted) disableBackBtn();
  // };
  // window.onunload = () => void 0;

  let flag = 0;
  const searchBtn = document.querySelector("#searchBtn");
  const searchBox = document.querySelector("#searchBox");
  const searchBox2 = document.querySelector("#searchBox2");
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      // console.log(window.innerWidth)

      if (window.innerWidth > 500) {
        if (flag === 0) {
          searchBox.style.width = "25vmax";
          document.querySelector("h2").style.opacity = "1";
          document.querySelector(".inputField").style.opacity = "1";
          document.querySelector(".searchList").style.opacity = "1";
          document.querySelector("#searchCrossBtn").style.opacity = "1";
          flag = 1;
        } else {
          document.querySelector("h2").style.opacity = "0";
          document.querySelector(".inputField").style.opacity = "0";
          document.querySelector(".searchList").style.opacity = "0";
          searchBox.style.width = "0vmax";
          flag = 0;
        }

        document
          .querySelector("#searchCrossBtn")
          .addEventListener("click", () => {
            document.querySelector("h2").style.opacity = "0";
            document.querySelector(".inputField").style.opacity = "0";
            document.querySelector(".searchList").style.opacity = "0";
            document.querySelector("#searchCrossBtn").style.opacity = "0";
            searchBox.style.width = "0vmax";
            flag = 0;
          });
      } else {
        // console.log(window.innerWidth)
        if (flag === 0) {
          searchBox2.style.opacity = "1";
          searchBox2.style.minHeight = "17vmax";
          document.querySelector("h2").style.opacity = "1";
          document.querySelector(".inputField").style.opacity = "1";
          document.querySelector(".searchList").style.opacity = "1";
          document.querySelector("#searchCrossBtn2").style.opacity = "1";
          searchBox2.style.pointerEvents = "initial";
          flag = 1;
        } else {
          searchBox2.style.pointerEvents = "none";
          document.querySelector("h2").style.opacity = "0";
          document.querySelector(".inputField").style.opacity = "0";
          document.querySelector(".searchList").style.opacity = "0";
          document.querySelector("h2").style.opacity = "0";
          searchBox2.style.minHeight = "0vmax";
          searchBox2.style.opacity = "0";
          flag = 0;
        }

        document
          .querySelector("#searchCrossBtn2")
          .addEventListener("click", () => {
            searchBox2.style.pointerEvents = "none";
            document.querySelector("h2").style.opacity = "0";
            document.querySelector(".inputField").style.opacity = "0";
            document.querySelector(".searchList").style.opacity = "0";
            document.querySelector("#searchCrossBtn2").style.opacity = "0";
            searchBox2.style.minHeight = "0vmax";
            searchBox2.style.opacity = "0";
            flag = 0;
          });
      }
    });
  }

  // const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  // var num = 300000;
  // console.log(formatter.format(num));

  //  ------------------------- upload picture  -------------------------

  let uploadBtn = document.querySelector("#upload");
  let uploadCrossBtn = document.querySelector("#uploadCrossBtn");
  let uploadCrossBtn2 = document.querySelector("#uploadCrossBtn2");

  if (window.innerWidth > 500) {
    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => {
        // console.log("click");
        document.querySelector("#uploadBox").style.opacity = 1;
        document.querySelector("#uploadBox").style.pointerEvents = "initial";
      });

      uploadCrossBtn.addEventListener("click", () => {
        // console.log("click");
        document.querySelector("#uploadBox").style.pointerEvents = "none";
        document.querySelector("#uploadBox").style.opacity = 0;
      });
    }
  } else {
    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => {
        // console.log("click");
        document.querySelector("#uploadBox").style.opacity = 1;
        document.querySelector("#uploadBox").style.pointerEvents = "initial";
      });

      uploadCrossBtn2.addEventListener("click", () => {
        // console.log("click");
        document.querySelector("#uploadBox").style.pointerEvents = "none";
        document.querySelector("#uploadBox").style.opacity = 0;
      });
    }
  }

  let fileInput = document.querySelector("#input");
  let fileInputBtn = document.querySelector("#btn");

  if (fileInputBtn) {
    fileInputBtn.addEventListener("click", () => {
      fileInput.click();
      fileInput.addEventListener("change", function (e) {
        document.querySelector("#imgU").style.display = "initial";
        document
          .querySelector("#imgU")
          .setAttribute("src", URL.createObjectURL(e.target.files[0]));
        console.log(e.target.files[0].name);
        document.querySelector(
          ".imgName"
        ).innerHTML = `${e.target.files[0].name}`;
        document.querySelector(".imgName").style.padding = "2vmax 2vmax";
      });
    });
  }

  // --------------------------------------------------------------

  let options = document.querySelectorAll(".options");
  let optionDiv = document.querySelector(".optionDiv");
  let closeOption = document.querySelector("#closeOption");

  options.forEach((item, index) => {
    item.addEventListener("click", () => {
      optionDiv.style.opacity = "1";
      optionDiv.style.pointerEvents = "initial";
    });
  });

  if (closeOption) {
    closeOption.addEventListener("click", () => {
      optionDiv.style.opacity = "0";
      optionDiv.style.pointerEvents = "none";
    });
  }

  // let commentBtns = document.querySelectorAll('#comments');
  // for(let i = 0; i < commentBtns.length; i++){
  //     commentBtns[i].addEventListener('click', ()=>{
  //         document.querySelector('#commentBox'+i).style.opacity = 1;
  //         document.querySelector('#commentBox'+i).style.pointerEvents = 'initial';
  //     });
  // }

  // let commentCrossBtns = document.querySelectorAll('#commentCrossBtn');
  // for(let i = 0; i < commentCrossBtns.length; i++){
  //     commentCrossBtns[i].addEventListener('click', ()=>{
  //         document.querySelector('#commentBox'+i).style.opacity = 0;
  //         document.querySelector('#commentBox'+i).style.pointerEvents = 'none';
  //     });
  // }
});
