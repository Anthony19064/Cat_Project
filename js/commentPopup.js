import { search_post, search_comment, search_accountByid, search_accountByusername, addComment } from './db.js';

export async function createCommetPopup(PostId) {
  let usersession = sessionStorage.getItem("user");
  if (usersession) {
    const post = await search_post(PostId);

    let cat_sex = post.sex === 'Male' ? '♂' : '♀';

    const commentpopPopup = document.getElementById("commentpop-popup");
    commentpopPopup.style.display = 'flex'

    commentpopPopup.innerHTML = '';

    if (commentpopPopup.innerHTML.trim() === '') {

      const commentpop = document.createElement('div');
      commentpop.classList.add('commentpop-box');

      const commentClose = document.createElement('span');
      commentClose.classList.add('commentpop-close');
      commentClose.id = 'commentpop-close';
      commentClose.onclick = () => {
        commentpopPopup.style.display = 'none'
      }

      const iconClose = document.createElement('i');
      iconClose.classList.add('fa-solid', 'fa-xmark');
      iconClose.style.color = '#f98b24';

      commentClose.appendChild(iconClose);

      const postProfile = document.createElement('div');
      postProfile.classList.add('commentpop-profile');

      const imgCat = document.createElement('img');
      imgCat.src = post.img;
      imgCat.alt = post.catname;

      const catName = document.createElement('p');
      catName.classList.add('CatName');
      catName.textContent = `${post.catname} ${cat_sex}`;

      postProfile.appendChild(imgCat);
      postProfile.appendChild(catName);

      const commentList = document.createElement('div');
      commentList.classList.add('commentpop-comments')

      const comments = await search_comment(post.id);
      comments.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

      for (const comment of comments) {

        const ownerComment = await search_accountByid(comment.ownerComment);

        const commentItem = document.createElement('div');
        commentItem.classList.add('commentpop-item');

        const pictureOwner = document.createElement('img');
        pictureOwner.src = ownerComment.img;

        const text = document.createElement('p');
        text.textContent = comment.text;

        commentItem.appendChild(pictureOwner);
        commentItem.appendChild(text);
        commentList.appendChild(commentItem);
      }

      const commentInput = document.createElement('div');
      commentInput.classList.add('commentpop-input');

      const imgUser = document.createElement('img');
      const userOwner = await search_accountByusername(usersession);
      imgUser.src = userOwner.img;

      const inputText = document.createElement('input');
      inputText.id = 'textComment';
      inputText.type = "text";
      inputText.placeholder = "พูดอะไรสักอย่างกับ " + post.catname + " ?";

      const buttonSend = document.createElement('button');
      buttonSend.onclick = async () => {
        console.log(PostId);
        const countComment = document.querySelector("#" + PostId);
        console.log(countComment)
        const comment = document.getElementById('textComment').value;
        if (usersession) {
          if (comment) {
            await addComment(usersession, PostId, comment);
            const post_now = await search_post(PostId);
            console.log(post_now);
            countComment.innerHTML = post_now.countComment;

            const ownerComment = await search_accountByusername(usersession);

            const commentItem = document.createElement('div');
            commentItem.classList.add('commentpop-item');

            const pictureOwner = document.createElement('img');
            pictureOwner.src = ownerComment.img;

            const text = document.createElement('p');
            text.textContent = comment;

            commentItem.appendChild(pictureOwner);
            commentItem.appendChild(text);

            commentList.appendChild(commentItem);
            document.getElementById('textComment').value = '';
          }
          else {
            alert("กรุณากรอกข้อความ");
          }
        } else {
          alert("กรุณา Login ก่อน");
        }

      }
      const iconButton = document.createElement('i');
      iconButton.classList.add('fa-solid', 'fa-paper-plane')

      buttonSend.appendChild(iconButton);


      commentInput.appendChild(imgUser);
      commentInput.appendChild(inputText);
      commentInput.appendChild(buttonSend);



      commentpop.appendChild(commentClose);
      commentpop.appendChild(postProfile);
      commentpop.appendChild(commentList);
      commentpop.appendChild(commentInput);


      commentpopPopup.appendChild(commentpop);
    }
  }

}