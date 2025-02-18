import { timeAgo } from "./timeago.js";
import { getPostData, search_accountByusername, search_statelike, addStateLike, deleteStateLike, search_stateBook, addStateBook, deleteStateBook, search_post } from "./db.js";
import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";
import { createCommetPopup } from "./commentPopup.js";
import { crate_popup } from "./adoptPopup.js";


// Render data on the page
export async function displayPosts() {
  let usersession = sessionStorage.getItem("user");
  const catListElement = document.querySelector('#catList');
  const posts = await getPostData();

  posts.sort((a, b) => a.timestamp - b.timestamp);

  posts.forEach(async post => {

    if (post.status == true) {
      const timepost = timeAgo(post.time.toDate());

      let cat_sex = post.sex === 'Male' ? '♂' : '♀';
      // Create the card container
      const card = document.createElement('div');
      card.classList.add('card', 'cat-card', 'mb-3');

      // Create a flex container for image and details
      const cardContent = document.createElement('div');
      cardContent.classList.add('top-section', 'd-flex', 'align-items-center');

      // Create the image
      const img = document.createElement('img');
      img.classList.add('cat-img', );
      img.src = post.img;
      img.alt = post.catname;

      // Create the text container
      const textContainer = document.createElement('div');
      textContainer.classList.add('top-right')
      const locationContainer = document.createElement('p');
      locationContainer.classList.add('location');

      const locationValue = document.createElement('span');
      locationValue.textContent = post.location;

      const catnameValue = document.createElement('span');
      catnameValue.classList.add('catnameMobile');
      catnameValue.textContent = ` ${post.catname} ${cat_sex}`;

      const space = document.createElement('p');
      space.classList.add("space");
      space.innerHTML = "&nbsp;|&nbsp;";

      locationContainer.appendChild(locationValue);
      locationContainer.appendChild(space);
      locationContainer.appendChild(catnameValue);

      const time = document.createElement('p');
      time.classList.add('timepost', 'mb-1');
      time.textContent = timepost;

      const details = document.createElement('p');
      details.classList.add('detail', 'mb-0');
      details.textContent = post.details;

      textContainer.appendChild(locationContainer);
      textContainer.appendChild(time);
      textContainer.appendChild(details);

      cardContent.appendChild(img);
      cardContent.appendChild(textContainer);

      // Create the bottom section
      const bottomSection = document.createElement('div');
      bottomSection.classList.add('bottom-section', 'd-flex', 'justify-content-between', 'align-items-center');

      const catInfo = document.createElement('p');
      catInfo.classList.add('catname');
      catInfo.textContent = `${post.catname} ${cat_sex}`;

      const statsContainer = document.createElement('div');
      statsContainer.classList.add('social-button');

      const heartSpan = document.createElement('button');
      heartSpan.classList.add('bt-like', 'me-2');
      heartSpan.addEventListener("click", () => {
        if (!usersession) {
          window.location.href = "../html/regis.html";
        }
      })

      // สร้าง Canvas element เพื่อแสดงแอนิเมชัน
      const canvas_like = document.createElement('canvas');
      canvas_like.classList.add('hicon');

      const countLike = document.createElement('p');
      countLike.classList.add('cl');
      countLike.textContent = post.countLike;

      // เพิ่ม canvas และข้อความลงใน heartSpan
      heartSpan.appendChild(canvas_like);
      heartSpan.appendChild(countLike);

      // ใช้ DotLottie เพื่อโหลดและเล่นแอนิเมชัน


      const lottie_heart = new DotLottie({
        autoplay: false,
        loop: false,
        canvas: canvas_like,
        src: "https://lottie.host/14f6d19a-b5e8-46eb-b748-7ac4d1bcb8a1/4j7NhgL0U9.lottie",
      });

      statsContainer.appendChild(heartSpan);



      //----------------------------------------------------------------------------   

      const commentSpan = document.createElement('button');
      commentSpan.classList.add('bt-comment', 'me-2');
      commentSpan.id = 'commentpop-open';
      commentSpan.addEventListener("click", () => {
        if (usersession) {
          createCommetPopup(post.id);
        } else {
          window.location.href = "../html/regis.html";
        }
      })

      // สร้าง Canvas element เพื่อแสดงแอนิเมชัน
      const canvas_comment = document.createElement('canvas');
      canvas_comment.classList.add('cicon');

      const countCom = document.createElement('p');
      countCom.classList.add('cc');
      countCom.id = post.id;
      countCom.textContent = post.countComment;

      // เพิ่ม canvas และข้อความลงใน heartSpan
      commentSpan.appendChild(canvas_comment);
      commentSpan.appendChild(countCom);

      // ใช้ DotLottie เพื่อโหลดและเล่นแอนิเมชัน
      const lottie_com = new DotLottie({
        autoplay: false,
        loop: false,
        canvas: canvas_comment,
        src: "https://lottie.host/44b4237f-ec34-4a60-a60c-7995c8a7d88d/hANFsu1A5H.lottie",
      });


      statsContainer.appendChild(commentSpan);

      //----------------------------------------------------------------------------

      const bookSpan = document.createElement('button');
      bookSpan.classList.add('bt-bookmark', 'me-2');
      bookSpan.addEventListener("click", () => {
        if (!usersession) {
          window.location.href = "../html/regis.html";
        }
      })

      // สร้าง Canvas element เพื่อแสดงแอนิเมชัน
      const canvas_book = document.createElement('canvas');
      canvas_book.classList.add('bicon');

      // เพิ่ม canvas และข้อความลงใน bookSpan
      bookSpan.appendChild(canvas_book);

      // ใช้ DotLottie เพื่อโหลดและเล่นแอนิเมชัน
      const lottie_book = new DotLottie({
        autoplay: false,
        loop: false,
        canvas: canvas_book,
        src: "https://lottie.host/1f94b5ed-8b25-426e-bbb9-05903fd9c233/8DHFiqpwUI.lottie",
      });

      statsContainer.appendChild(bookSpan);

      //----------------------------------------------------------------//

      Promise.all([
        new Promise(resolve => lottie_heart.addEventListener("load", resolve)),
        new Promise(resolve => lottie_book.addEventListener("load", resolve)),
        new Promise(resolve => lottie_com.addEventListener("load", resolve)),


      ]).then(async () => {
        // เช็คว่ามีการ Login ไหม ถ้ามีค่อยเรียกฟังก์ชั่น ไม่งั้นค่าเป็น null แล้วฟังก์ชั่นแจ้ง error
        let user = sessionStorage.getItem("user");
        if (user) {
          const account = await search_accountByusername(user);
          let bs_check = await search_statelike(account.username, post.id); // ตรวจสอบสถานะ like ก่อน
          if (bs_check) {
            lottie_heart.setFrame(lottie_heart.totalFrames - 1);
          } else {
            lottie_heart.setFrame(0);
          }

          lottie_heart.addEventListener("load", async () => {
            // การทำงานเพิ่มเติมหลังจากที่แอนิเมชัน heart โหลดเสร็จ
          });

          let bh_state = bs_check;  // เก็บสถานะของการ like เพื่อใช้งานในการคลิก
          heartSpan.addEventListener("click", async () => {
            if (!bh_state) {
              lottie_heart.setMode("forward");
              lottie_heart.play();
              await addStateLike(account.username, post.id);
              const post_now = await search_post(post.id);
              countLike.textContent = post_now.countLike;
              bh_state = true;
            } else {
              lottie_heart.setFrame(lottie_heart.totalFrames - 30);
              lottie_heart.setMode("reverse");
              lottie_heart.play();
              await deleteStateLike(account.username, post.id);
              const post_now = await search_post(post.id);
              countLike.textContent = post_now.countLike;
              bh_state = false;
            }
          });


          let bs_check_book = await search_stateBook(account.username, post.id); // ตรวจสอบสถานะ bookmark ก่อน
          if (bs_check_book) {
            lottie_book.setFrame(lottie_book.totalFrames - 1);
          } else {
            lottie_book.setFrame(0);
          }

          let bb_state = bs_check_book;  // เก็บสถานะของการ bookmark เพื่อใช้งานในการคลิก
          bookSpan.addEventListener("click", async () => {
            if (!bb_state) {
              lottie_book.setMode("forward");
              lottie_book.play();
              await addStateBook(account.username, post.id);
              bb_state = true;
            } else {
              lottie_book.setFrame(lottie_book.totalFrames - 30);
              lottie_book.setMode("reverse");
              lottie_book.play();
              await deleteStateBook(account.username, post.id);
              bb_state = false;
            }
          });
        }



      });



      const adoptButton = document.createElement('button');
      adoptButton.classList.add('btn', 'adopt-btn');
      adoptButton.textContent = 'ADOPT';
      adoptButton.addEventListener("click", async () => {
        if (usersession) {
          await crate_popup(post.catname);
        } else {
          window.location.href = "../html/regis.html";
        }
      });

      bottomSection.appendChild(catInfo);
      bottomSection.appendChild(statsContainer);
      bottomSection.appendChild(adoptButton);

      // Append everything to the card
      card.appendChild(cardContent);
      card.appendChild(bottomSection);

      // Append the card to the list container
      catListElement.appendChild(card);
    }

  });
}