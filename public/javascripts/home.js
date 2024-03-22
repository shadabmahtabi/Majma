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

  const searchBtn = document.querySelector('#searchBtn')
  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      console.log(e.target)
      if (flag === 0) {
        searchBox.style.width = "25vmax";
        document.querySelector("h2").style.opacity = "1";
        document.querySelector(".inputField").style.opacity = "1";
        document.querySelector(".searchList").style.opacity = "1";
        document.querySelector("#searchCrossBtn").style.opacity = '1'
        flag = 1;
      } else {
        document.querySelector("h2").style.opacity = "0";
        document.querySelector(".inputField").style.opacity = "0";
        document.querySelector(".searchList").style.opacity = "0";
        searchBox.style.width = "0vmax";
        flag = 0;
      }
    });

    document.querySelector("#searchCrossBtn").addEventListener("click", () => {
      document.querySelector("h2").style.opacity = "0";
      document.querySelector(".inputField").style.opacity = "0";
      document.querySelector(".searchList").style.opacity = "0";
      document.querySelector("#searchCrossBtn").style.opacity = '0'
      searchBox.style.width = "0vmax";
      flag = 0;
    });
  }

  // const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  // var num = 300000;
  // console.log(formatter.format(num));

  //  ------------------------- upload picture  -------------------------
  document.querySelector("#upload").addEventListener("click", () => {
    // console.log("click");
    document.querySelector("#uploadBox").style.opacity = 1;
    document.querySelector("#uploadBox").style.pointerEvents = "initial";
  });

  document.querySelector("#uploadCrossBtn").addEventListener("click", () => {
    // console.log("click");
    document.querySelector("#uploadBox").style.pointerEvents = "none";
    document.querySelector("#uploadBox").style.opacity = 0;
  });

  document.querySelector("#btn").addEventListener("click", () => {
    document.querySelector("#input").click();
    if (document.querySelector("#input").value) {
      document.querySelector(".imgName").innerHTML =
        document.querySelector("#input").value;
    }
  });

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
