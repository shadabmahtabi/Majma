// Search Fetch
const list = document.querySelector('.searchList');
function sendData(e , id) {
    let match = e.value.match(/^[a-zA-Z]*/);
    let match2 = e.value.match(/\s*/);

    if (match2[0] === e.value) {
        list.innerHTML = '';
        return;
    }

    if (match[0] === e.value) {
        fetch('getUsers', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: e.value })
        }).then(res => res.json()).then(data => {
            let user = data.user;
            list.innerHTML = '';
            if (user.length < 1) {
                list.innerHTML = '<li><a href="/" id="userLink"><div class="userProfilePic"></div>Sorry, Nothing Found.</a></li>';
                return;
            }
            user.forEach((item, index) => {
                // console.log(item.name);
                if (item._id !== id) {
                    list.innerHTML += `<li><a href="/profile/${item._id}" id="userLink"><div class="userProfilePic"><img src="/images/${item.profilePic}" alt="profile pic"></div>${item.name}</a></li>`
                }
            });
            return;
        })
    }
}



// like fetch

function likeUnlike(id, loggedInUser) {
    fetch('likeUnlike', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id })
    }).then(res => res.json()).then(data => {
        document.querySelectorAll('#totalLikes').forEach(item => {
            item.innerHTML = data.post.likes.length + ' likes';
        })
        // console.log(data)
        // console.log(data.post.likes.indexOf(loggedInUser))
        // document.querySelectorAll('#likes').forEach(likeDiv => {
        //     likeDiv.addEventListener('click', () => {
        //         if (data.post.likes.indexOf(loggedInUser) === -1) {
        //             likeDiv.innerHTML = '<i class="ri-heart-2-fill"></i>'
        //             likeDiv.style.color = 'red';
        //         } else {
        //             likeDiv.innerHTML = '<i class="ri-heart-2-line"></i>'
        //             likeDiv.style.color = 'var(--textColor)';
        //         }
        //     })
        // })
    })
}

// Post Comment

// function inpData() {
//     let inputData;
//     let addCommentBtn = document.querySelectorAll('#commentBtn');
//     for (let i = 0; i < addCommentBtn.length; i++) {
//         addCommentBtn[i].addEventListener('click', () => {
//             inputData = document.querySelector('#commentInput' + i).value.trim();

//             if (!inputData || inputData === "") {
//                 return alert("Nothing entered!!!")
//             }
//             console.log(inputData);
//             inputData = "";
//         });
//     }
// }

// function postComment(id) {


//     // fetch('comment', {
//     //     method: 'post',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify({ commentData: inputData, postId: id })
//     // }).then(res => res.json()).then(data => {
//     //     console.log(data);
//     // })


//     // var inputData = document.querySelector('#commentInput').value.trim();

// }