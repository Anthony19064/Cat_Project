import { timeAgo } from "./timeago.js";
import { getPostData, getBookmarkData, search_accountByid, search_statelike, addStateLike, deleteStateLike, search_stateBook, addStateBook, deleteStateBook, search_post } from "./db.js";
import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";
import { createCommetPopup } from "./commentPopup.js";
import { crate_popup } from "./adoptPopup.js";
import { sendNotification } from "./notification.js";
import { toggleDropdown } from "./dropdownPost.js";


// Render data on the page
export async function displayAllposts() {
  let usersession = sessionStorage.getItem("user");
  const account = await search_accountByid(usersession);
  const catListElement = document.querySelector('#catList');
  catListElement.innerHTML = "";
  const posts = await getPostData();

  posts.forEach(async post => {
    if (post.status == true) {
      const timepost = timeAgo(post.time.toDate());

      let cat_sex = post.sex === 'ชาย' ? '♂' : '♀';
      // Create the card container
      const card = document.createElement('div');
      card.classList.add('card', 'cat-card', 'mb-4');

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
      locationValue.classList.add('catlocationMobile');
      locationValue.textContent = post.location;

      const catnameValue = document.createElement('span');
      catnameValue.classList.add('catnameMobile');
      catnameValue.textContent = ` ${post.catname} ${cat_sex}`;


      locationContainer.appendChild(locationValue);
      locationContainer.appendChild(catnameValue);

      const time = document.createElement('p');
      time.classList.add('timepost', 'mb-1');
      time.textContent = timepost;

      const details = document.createElement('p');
      details.classList.add('detail', 'mb-0');
      details.textContent = post.details;

      
      const menu_container = document.createElement('div')
      menu_container.classList.add('menu-container');

      const menu_icon = document.createElement('div');
      menu_icon.classList.add('menu-icon');
      menu_icon.addEventListener("click", () => {
        if(usersession){
          
          toggleDropdown(post.id);
        }
        else{
          window.location.href = "../html/regis.html";
        }
      })

      const icon_more = document.createElement('i');
      icon_more.classList.add('fa-solid', 'fa-ellipsis');
      icon_more.style.color = "#ffffff";

      menu_icon.appendChild(icon_more)

      const dropdownMenu = document.createElement('div');
      dropdownMenu.classList.add("dropdown-menu");
      dropdownMenu.id = `dropdownMenu${post.id}`;

      
      menu_container.appendChild(menu_icon);
      menu_container.appendChild(dropdownMenu);
      

      const color = document.createElement('input');
      color.type = "hidden";
      color.classList.add("Pcatcolor")
      color.id = "Pcatcolor";
      color.value = post.catcolor;

      const age = document.createElement('input');
      age.type = "hidden";
      age.classList.add("Pcatage")
      age.id = "Pcatage";
      age.value = post.catage;

      const sex = document.createElement('input');
      sex.type = "hidden";
      sex.classList.add("Pcatsex")
      sex.id = "Pcatsex";
      sex.value = post.sex;



      textContainer.appendChild(locationContainer);
      textContainer.appendChild(time);
      textContainer.appendChild(details);
      textContainer.appendChild(color);
      textContainer.appendChild(age);
      textContainer.appendChild(sex);
      textContainer.appendChild(menu_container);
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
      heartSpan.addEventListener("click",async () => {
        if (!usersession) {
          window.location.href = "../html/regis.html";
        }
        else if(usersession != post.owner){
          await sendNotification(post.id, post.owner, "like", usersession);
          setTimeout(() => {
        }, 1000);
        
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
      commentSpan.addEventListener("click",async () => {
        if (usersession) {
            createCommetPopup(post.id);
        }
        else {
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
      bookSpan.addEventListener("click",async () => {
        if (!usersession) {
          window.location.href = "../html/regis.html";
        }
        else if(usersession){
          if (usersession != post.owner){
            await sendNotification(post.id, post.owner, "bookmark", usersession);
            setTimeout(() => {
          }, 1000);
          }
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
          const account = await search_accountByid(user);
          let bs_check = await search_statelike(account.id, post.id); // ตรวจสอบสถานะ like ก่อน
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
              await addStateLike(account.id, post.id);
              const post_now = await search_post(post.id);
              countLike.textContent = post_now.countLike;
              bh_state = true;
            } else {
              lottie_heart.setFrame(lottie_heart.totalFrames - 30);
              lottie_heart.setMode("reverse");
              lottie_heart.play();
              await deleteStateLike(account.id, post.id);
              const post_now = await search_post(post.id);
              countLike.textContent = post_now.countLike;
              bh_state = false;
            }
          });


          let bs_check_book = await search_stateBook(account.id, post.id); // ตรวจสอบสถานะ bookmark ก่อน
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
              await addStateBook(account.id, post.id);
              bb_state = true;
            } else {
              lottie_book.setFrame(lottie_book.totalFrames - 30);
              lottie_book.setMode("reverse");
              lottie_book.play();
              await deleteStateBook(account.id, post.id);
              bb_state = false;
            }
          });
        }



      });


      const adoptButton = document.createElement('button');
      adoptButton.classList.add('btn', 'adopt-btn');
      if(account){
        if(post.owner == account.id){
          adoptButton.disabled = true;
        }
      }
      adoptButton.textContent = 'รับเลี้ยง';
      adoptButton.addEventListener("click", async () => {
        if (usersession) {
          await crate_popup(post.id);
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



// Render data on the page
export async function displayMyposts() {
  let usersession = sessionStorage.getItem("user");
  const account = await search_accountByid(usersession);
  const ListElement = document.querySelector('#content-container');
  ListElement.innerHTML = "";
  const posts = await getPostData();

  posts.forEach(async post => {
    if(post.owner == account.id) {
        const timepost = timeAgo(post.time.toDate());
  
        let cat_sex = post.sex === 'ชาย' ? '♂' : '♀';
        // Create the card container
        const card = document.createElement('div');
        card.classList.add('card', 'cat-card', 'mb-4');
  
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
        locationValue.classList.add('catlocationMobile');
        locationValue.textContent = post.location;
  
        const catnameValue = document.createElement('span');
        catnameValue.classList.add('catnameMobile');
        catnameValue.textContent = ` ${post.catname} ${cat_sex}`;
  
  
        locationContainer.appendChild(locationValue);
        locationContainer.appendChild(catnameValue);
  
        const time = document.createElement('p');
        time.classList.add('timepost', 'mb-1');
        time.textContent = timepost;
  
        const details = document.createElement('p');
        details.classList.add('detail', 'mb-0');
        details.textContent = post.details;

        const menu_container = document.createElement('div')
        menu_container.classList.add('menu-container');

        const menu_icon = document.createElement('div');
        menu_icon.classList.add('menu-icon');
        menu_icon.addEventListener("click", () => {
          if (usersession){
            toggleDropdown(post.id);
          }
          else{
            window.location.href = "../html/regis.html";
          }
        })

        const icon_more = document.createElement('i');
        icon_more.classList.add('fa-solid', 'fa-ellipsis');
        icon_more.style.color = "#ffffff";

        menu_icon.appendChild(icon_more)

        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add("dropdown-menu");
        dropdownMenu.id = `dropdownMenu${post.id}`;

        
        menu_container.appendChild(menu_icon);
        menu_container.appendChild(dropdownMenu);
        


        textContainer.appendChild(locationContainer);
        textContainer.appendChild(time);
        textContainer.appendChild(details);
        textContainer.appendChild(menu_container);
  
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
            const account = await search_accountByid(user);
            let bs_check = await search_statelike(account.id, post.id); // ตรวจสอบสถานะ like ก่อน
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
                await addStateLike(account.id, post.id);
                const post_now = await search_post(post.id);
                countLike.textContent = post_now.countLike;
                bh_state = true;
              } else {
                lottie_heart.setFrame(lottie_heart.totalFrames - 30);
                lottie_heart.setMode("reverse");
                lottie_heart.play();
                await deleteStateLike(account.id, post.id);
                const post_now = await search_post(post.id);
                countLike.textContent = post_now.countLike;
                bh_state = false;
              }
            });
  
  
            let bs_check_book = await search_stateBook(account.id, post.id); // ตรวจสอบสถานะ bookmark ก่อน
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
                await addStateBook(account.id, post.id);
                bb_state = true;
              } else {
                lottie_book.setFrame(lottie_book.totalFrames - 30);
                lottie_book.setMode("reverse");
                lottie_book.play();
                await deleteStateBook(account.id, post.id);
                bb_state = false;
              }
            });
          }
  
  
  
        });
  


        const adoptButton = document.createElement('button');
        adoptButton.classList.add('btn', 'adopt-btn');
        adoptButton.disabled = true;
        adoptButton.textContent = 'รับเลี้ยง';
        adoptButton.addEventListener("click", async () => {
          if (usersession) {
            await crate_popup(post.id);
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
        ListElement.appendChild(card);
      }
  
    
    } 
  );

}

export async function displayBookmark() {
  let usersession = sessionStorage.getItem("user");
  const account = await search_accountByid(usersession);
  const posts = await getPostData();
  const bookmarks = await getBookmarkData();
  const ListElement = document.querySelector('#content-container');
  ListElement.innerHTML = "";

  bookmarks.forEach(async bookmark =>{
    if(bookmark.user == account.id){
      posts.forEach(async post => {
          if(post.id == bookmark.post_id){
            if (post.status == true) {
              const timepost = timeAgo(post.time.toDate());
        
              let cat_sex = post.sex === 'ชาย' ? '♂' : '♀';
              // Create the card container
              const card = document.createElement('div');
              card.classList.add('card', 'cat-card', 'mb-4');
        
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
              locationValue.classList.add('catlocationMobile');
              locationValue.textContent = post.location;
        
              const catnameValue = document.createElement('span');
              catnameValue.classList.add('catnameMobile');
              catnameValue.textContent = ` ${post.catname} ${cat_sex}`;
        
        
              locationContainer.appendChild(locationValue);
              locationContainer.appendChild(catnameValue);
        
              const time = document.createElement('p');
              time.classList.add('timepost', 'mb-1');
              time.textContent = timepost;
        
              const details = document.createElement('p');
              details.classList.add('detail', 'mb-0');
              details.textContent = post.details;

              const menu_container = document.createElement('div')
              menu_container.classList.add('menu-container');
      
              const menu_icon = document.createElement('div');
              menu_icon.classList.add('menu-icon');
              menu_icon.addEventListener("click", () => {
                if (usersession){
                  toggleDropdown(post.id);
                }
                else{
                  window.location.href = "../html/regis.html";
                }
              })
      
              const icon_more = document.createElement('i');
              icon_more.classList.add('fa-solid', 'fa-ellipsis');
              icon_more.style.color = "#ffffff";
      
              menu_icon.appendChild(icon_more)
      
              const dropdownMenu = document.createElement('div');
              dropdownMenu.classList.add("dropdown-menu");
              dropdownMenu.id = `dropdownMenu${post.id}`;
      
              
              menu_container.appendChild(menu_icon);
              menu_container.appendChild(dropdownMenu);
        
              textContainer.appendChild(locationContainer);
              textContainer.appendChild(time);
              textContainer.appendChild(details);
              textContainer.appendChild(menu_container);
        
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
                  const account = await search_accountByid(user);
                  let bs_check = await search_statelike(account.id, post.id); // ตรวจสอบสถานะ like ก่อน
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
                      await addStateLike(account.id, post.id);
                      const post_now = await search_post(post.id);
                      countLike.textContent = post_now.countLike;
                      bh_state = true;
                    } else {
                      lottie_heart.setFrame(lottie_heart.totalFrames - 30);
                      lottie_heart.setMode("reverse");
                      lottie_heart.play();
                      await deleteStateLike(account.id, post.id);
                      const post_now = await search_post(post.id);
                      countLike.textContent = post_now.countLike;
                      bh_state = false;
                    }
                  });
        
        
                  let bs_check_book = await search_stateBook(account.id, post.id); // ตรวจสอบสถานะ bookmark ก่อน
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
                      await addStateBook(account.id, post.id);
                      bb_state = true;
                    } else {
                      lottie_book.setFrame(lottie_book.totalFrames - 30);
                      lottie_book.setMode("reverse");
                      lottie_book.play();
                      await deleteStateBook(account.id, post.id);
                      bb_state = false;
                    }
                  });
                }
        
        
        
              });
        
        
        
              const adoptButton = document.createElement('button');
              adoptButton.classList.add('btn', 'adopt-btn');
              if(post.owner == account.id){
                adoptButton.disabled = true;
              }
              adoptButton.textContent = 'รับเลี้ยง';
              adoptButton.addEventListener("click", async () => {
                if (usersession) {
                  await crate_popup(post.id);
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
              ListElement.appendChild(card);
            }
          }
      });    
    }
  })


}