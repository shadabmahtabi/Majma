let sets = document.querySelectorAll('.sets');
let profileForm = document.querySelector('.profileForm');
let passwordForm = document.querySelector('.passwordForm');
let deleteForm = document.querySelector('.deleteForm');

sets.forEach( opt => {
    opt.addEventListener('click', (e) => {
        console.log(e.target.classList)
        document.querySelector('#heading').innerHTML = `Settings / ${e.target.innerText}`;
        if(e.target.innerText === 'Change Password') {

            profileForm.style.zIndex = '1'
            deleteForm.style.zIndex = '2'
            passwordForm.style.zIndex = '3'


        } else if(e.target.innerText === 'Delete Account') {

            passwordForm.style.zIndex = '1'
            profileForm.style.zIndex = '2'
            deleteForm.style.zIndex = '3'

        } else {

            deleteForm.style.zIndex = '1'
            passwordForm.style.zIndex = '2'
            profileForm.style.zIndex = '3'

        }
    })
})
