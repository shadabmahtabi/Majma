// Search Fetch
const list = document.querySelector(".searchList");
const list2 = document.querySelector(".searchList2");
function sendData(e, id) {
  let match = e.value.match(/^[a-zA-Z]*/);
  let match2 = e.value.match(/\s*/);

  if (match2[0] === e.value) {
    list.innerHTML = "";
    list2.innerHTML = "";
    return;
  }

  if (match[0] === e.value) {
    fetch("getUsers", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: e.value }),
    })
      .then((res) => res.json())
      .then((data) => {
        let user = data.user;
        if (window.innerWidth > 500) {
          list.innerHTML = "";
          if (user.length < 1) {
            list.innerHTML =
              '<li><a href="/" id="userLink"><div class="userProfilePic"></div>Sorry, No User Found.</a></li>';
            return;
          }
          user.forEach((item, index) => {
            // console.log(item.name);
            if (item._id !== id) {
              list.innerHTML += `<li><a href="/profile/${item.username}" id="userLink"><div class="userProfilePic"><img src="/images/${item.profilePic}" alt="profile pic"></div>${item.name}</a></li>`;
            }
          });
          return;
        } else {
          list2.innerHTML = "";
          if (user.length < 1) {
            list2.innerHTML =
              '<li><a href="/" id="userLink"><div class="userProfilePic"></div>Sorry, No User Found.</a></li>';
            return;
          }
          user.forEach((item, index) => {
            // console.log(item.name);
            if (item._id !== id) {
              list2.innerHTML += `<li><a href="/profile/${item.username}" id="userLink"><div class="userProfilePic"><img src="/images/${item.profilePic}" alt="profile pic"></div>${item.name}</a></li>`;
            }
          });
          return;
        }
      });
  }
}

