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

  // ---------------- attach event listeners ----------------

  // Function to attach event listeners to dynamically loaded elements
  function attachEventListeners() {
    const options = document.querySelectorAll(".options");
    const closeOptions = document.querySelectorAll("#closeOption");

    options.forEach((item) => {
      item.addEventListener("click", () => {
        const optionDiv = item.nextElementSibling; // Select the corresponding optionDiv
        optionDiv.style.opacity = "1";
        optionDiv.style.pointerEvents = "initial";
      });
    });

    closeOptions.forEach((item) => {
      item.addEventListener("click", () => {
        const optionDiv = item.closest(".optionDiv"); // Select the closest optionDiv
        optionDiv.style.opacity = "0";
        optionDiv.style.pointerEvents = "none";
      });
    });

    const likeButtons = document.querySelectorAll(".like-btn");
    likeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const postId = button.getAttribute("data-post-id");
        likeUnlike(postId, loggedInUser._id);
      });
    });
  }

  // -------------------- Load More ----------------------------
  let page = 1;
  const limit = 10;
  const postSection = document.querySelector(".posts");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (document.getElementById("loggedInUser")) {
    const loggedInUser = JSON.parse(
      document.getElementById("loggedInUser").value
    ); // Assuming you pass loggedInUser as a JSON string in a hidden input field
  }

  // Set to track loaded post IDs to avoid duplicates
  const loadedPostIds = new Set();
  let isLoading = false;
  let allPostsLoaded = false;

  // Function to create HTML structure for a post
  function createPostHTML(post, loggedInUser) {
    if (!post || !post.user) return "";

    const likeIconClass = "ri-heart-3-line"; // Assuming the post is not liked initially
    var length
    if (window.innerWidth <= 500) {
      length = 15;
    } else {
      length = 40;
    }

    if (post.likedUser) {
      var likedUserName = post.likedUser.name;
      var trimmedlikedUserName =
      likedUserName.length > length
      ? likedUserName.substring(0, length - 3) + "..."
      : likedUserName;
    }

    return `
      <div class="post" id="post-${post._id}">
        <nav class="postNav">
          <div class="postUser">
            <div class="postUserPic"><a href="/profile/${
              post.user.username
            }"><img src="/images/${
      post.user.profilePic
    }" alt="Profile Pic"></a></div>
            <div class="postUserName"><a href="/profile/${
              post.user.username
            }"><h3>${post.user.name}</h3></a></div>
          </div>
          <div class="options"><i class="ri-more-fill"></i></div>
          <div class="optionDiv">
            <ul class="optionBox">
              ${loggedInUser.following ?
                loggedInUser.following.includes(post.user._id)
                  ? `<li><a href="/follow/${post.user._id}" class="followBtn"><div>Unfollow</div></a></li>`
                  : `<li><a href="/follow/${post.user._id}">Follow</a></li>`
                  : ""
              }
              <li><a href="#" class="reportBtn">Report</a></li>
              <li id="closeOption">Cancel</li>
            </ul>
          </div>
        </nav>
        <div class="descBox">${post.desc}</div>
        <div class="postPic">
          ${
            post.blog
              ? `<p class="blog">${post.blog}</p>`
              : post.image
              ? `<img src="/images/${post.image}" alt="">`
              : ""
          }
        </div>
        <div class="postReaction">
          <div class="icons">
            <div id="likes" class="like-btn" data-post-id="${post._id}">
              <i class="${likeIconClass}"></i>
            </div>
            <div id="comments"><a href="/comment/${
              post._id
            }"><i class="ri-chat-1-line"></i></a></div>
          </div>
          <div class="icons">
            <div id="save"><a href="/progress"><i class="ri-bookmark-line"></i></a></div>
          </div>
        </div>
        <div class="likesCommentDiv">
          <h4 id="totalLikes">${
            post.likedUser
              ? `<div class="likedUserPic"><img src="/images/${
                  post.likedUser.profilePic
                }" alt="" /></div>&nbsp; Liked By &nbsp;<a href="/profile/${
                  post.likedUser.username
                }" style="color: inherit; text-decoration: none; font-weight: 500;">${trimmedlikedUserName}</a>&nbsp; ${
                  post.likesCount === 0 ? "" : ` and ${post.likesCount} others`
                }`
              : `${post.likesCount} likes`
          }</h4>
          <h4>${
            post.commentCount > 0
              ? `<a href="/comment/${post._id}" style="color: inherit; text-decoration: none;">View all ${post.commentCount} comments</a>`
              : "0 comments"
          }</h4>
        </div>
      </div>
    `;
  }

  // onclick="likeUnlike('${post._id}', '${
  //   loggedInUser._id
  // }')"

  // Function to load more posts
  async function loadMorePosts() {
    if (isLoading || allPostsLoaded) return;
    isLoading = true;
    try {
      const response = await axios.get(
        `/loadMorePosts?page=${page}&limit=${limit}`
      );
      const newPosts = response.data;
      // console.log(newPosts)

      if (newPosts.length === 0) {
        allPostsLoaded = true;
        loadMoreBtn.style.display = "none"; // Hide the button if no more posts are loaded
        return; // Exit the function if no more posts are loaded
      }

      newPosts.forEach((post) => {
        if (!loadedPostIds.has(post._id)) {
          // Check if the post is already loaded
          loadedPostIds.add(post._id); // Add the post ID to the set
          const postHTML = createPostHTML(post, loggedInUser);
          if (postHTML) {
            postSection.insertAdjacentHTML("beforeend", postHTML);
          }
        }
      });

      // Reattach event listeners to newly added posts
      attachEventListeners();

      page++;
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      isLoading = false;
    }
  }

  async function likeUnlike(postId, userId) {
    try {
      const response = await axios.post(`/likeUnlike/${postId}`);
      if (response.data.success) {
        const postElement = document.getElementById(`post-${postId}`);
        const likesCountElement = postElement.querySelector("#totalLikes");
        const likeIconElement = postElement.querySelector("#likes i");

        likesCountElement.textContent = `${response.data.likes} likes`;

        if (likeIconElement.classList.contains("ri-heart-3-line")) {
          likeIconElement.classList.remove("ri-heart-3-line");
          likeIconElement.classList.add("ri-heart-3-fill");
        } else {
          likeIconElement.classList.remove("ri-heart-3-fill");
          likeIconElement.classList.add("ri-heart-3-line");
        }
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  }

  // Initial attachment of event listeners
  attachEventListeners();

  // Initial load
  loadMorePosts();
  loadMoreBtn.style.display = "block";

  // Load more posts on button click
  loadMoreBtn.addEventListener("click", loadMorePosts);

  // Show the "Load More" button when scrolling to the bottom
  document.getElementById("postSection").addEventListener("scroll", () => {
    if (isLoading || allPostsLoaded) return;

    const { scrollTop, scrollHeight, clientHeight } =
      document.getElementById("postSection");
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      loadMorePosts();
    }
  });
});
