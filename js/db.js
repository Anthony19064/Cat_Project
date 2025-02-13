// Import Firebase SDK from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, where, query, setDoc, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";



// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3D8w5hAidJnwAybd_AEZoBFKDtjSl0UU",
  authDomain: "catprojectce.firebaseapp.com",
  projectId: "catprojectce",
  storageBucket: "catprojectce.firebasestorage.app",
  messagingSenderId: "128805338272",
  appId: "1:128805338272:web:fd50c8bc8f73bef823ddc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Fetch cat data from Firestore
async function getPostData() {
  const post = collection(db, 'Post');
  const postSnapshot = await getDocs(post);
  return postSnapshot.docs.map(doc => doc.data());
}

async function getAccountData() {
  const Account = collection(db, 'Account');
  const accountSnapshot = await getDocs(Account);
  return accountSnapshot.docs.map(doc => doc.data());
}

async function getCommenttData() {
  const Comment = collection(db, 'Comment');
  const commentSnapshot = await getDocs(Comment);
  return commentSnapshot.docs.map(doc => doc.data());
}

async function getStateLike() {
  const State = collection(db, 'State-like');
  const stateSnapshot = await getDocs(State);
  return stateSnapshot.docs.map(doc => doc.data());
}

//-------------------Like----------------------

async function search_statelike(username, postId) {
  try {
    const stateRef = collection(db, 'state-like');
    let q = query(stateRef, where("user", "==", username), where("post_id", "==", postId));
    let querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true
    }
    else {
      return false
    }
  } catch (e) {
    console.error(e);
  }
}

async function addStateLike(username, postID) {
  const docRef = await addDoc(collection(db, "state-like"), {
    user: username,
    post_id: postID,
  });
  console.log('add success');
}

async function deleteStateLike(username, postID) {
  const stateRef = collection(db, 'state-like');
  let q = query(stateRef, where("user", "==", username), where("post_id", "==", postID));
  let querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "state-like", docSnapshot.id));
      console.log('delete success');
      return true
    });
  }
}

//-------------------------------------------------

//-------------------Bookmark----------------------

async function search_stateBook(username, postId) {
  try {
    const stateRef = collection(db, 'state-bookmark');
    let q = query(stateRef, where("user", "==", username), where("post_id", "==", postId));
    let querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true
    }
    else {
      return false
    }
  } catch (e) {
    console.error(e);
  }
}

async function addStateBook(username, postID) {
  const docRef = await addDoc(collection(db, "state-bookmark"), {
    user: username,
    post_id: postID,
  });
  console.log('add success');
}

async function deleteStateBook(username, postID) {
  const stateRef = collection(db, 'state-bookmark');
  let q = query(stateRef, where("user", "==", username), where("post_id", "==", postID));
  let querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "state-bookmark", docSnapshot.id));
      console.log('delete success');
      return true
    });
  }
}

//-------------------------------------------------


// search หา account
export async function login(usernameOrEmail, password) {
  try {
    const accountRef = collection(db, "Account");

    // ลองค้นหาด้วย username ก่อน
    let q = query(accountRef, where("username", "==", usernameOrEmail), where("password", "==", password));
    let querySnapshot = await getDocs(q);

    // ถ้าไม่เจอ username ให้ลองค้นหาด้วย email
    if (querySnapshot.empty) {
      q = query(accountRef, where("mail", "==", usernameOrEmail), where("password", "==", password));
      querySnapshot = await getDocs(q);
    }

    // ถ้าเจอ username หรือ email พร้อม password ที่ถูกต้อง
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    }
  } catch (error) {
    console.error("Error searching account:", error);
  }
  return false;
}

export async function search_account(username) {
  if (username) {
    try {
      const accountRef = collection(db, "Account");
      let q = query(accountRef, where("username", "==", username));
      let querySnapshot = await getDocs(q);
      if (querySnapshot) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      }
    } catch (e) {
      console.error("Error searching account:", e);
    }
  }
}

// ฟังก์ชันเพื่ออัปโหลดไฟล์รูป
export async function uploadImage(file) {
  const storageRef = ref(storage, `profile_images/${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
}


export async function register(username, phone, password, name, mail, contract, imageFile) {
  try {
    const imageUrl = await uploadImage(imageFile);

    const docRef = await addDoc(collection(db, "Account"), {
      name: name,
      phone: phone,
      contract: contract,
      username: username,
      password: password,
      mail: mail,
      img: imageUrl,
    });
    console.log("Account added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding cat: ", e);
  }
}


async function addPostData(catName, catSex, catLocation, catImg, catDetails, ownerPost) {
  try {
    const docRef = await addDoc(collection(db, "Post"), {}); // สร้าง document เปล่าก่อน เพื่อให้ได้ docRef.id

    await setDoc(docRef, {  // ใช้ setDoc เพื่ออัปเดตข้อมูลพร้อม id
      id: docRef.id,  // บันทึก document ID ลงไปใน field
      name: catName,
      sex: catSex,
      location: catLocation,
      img: catImg,
      details: catDetails,
      owner: ownerPost,
      time: serverTimestamp(),
    });

    console.log("Cat added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding cat: ", e);
  }
}


function timeAgo(timeString) {
  const currentTime = new Date();

  const diffInMs = currentTime - timeString;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else {
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  }
}




// Render data on the page
export async function displayPosts() {
  const catListElement = document.querySelector('#catList');
  const posts = await getPostData();



  posts.forEach(async post => {


    const timepost = timeAgo(post.time.toDate());

    let cat_sex = '';
    if (post.sex == 'Male') {
      cat_sex = '♂';
    }
    else {
      cat_sex = '♀';
    }
    // Create the card container
    const card = document.createElement('div');
    card.classList.add('card', 'cat-card', 'mb-3');

    // Create a flex container for image and details
    const cardContent = document.createElement('div');
    cardContent.classList.add('d-flex', 'align-items-center');

    // Create the image
    const img = document.createElement('img');
    img.classList.add('cat-img', 'me-3');
    img.src = post.img;
    img.alt = post.catname;

    // Create the text container
    const textContainer = document.createElement('div');
    textContainer.classList.add('top-right')
    const ownerName = document.createElement('p');
    ownerName.classList.add('location');
    ownerName.textContent = post.location; // Update as needed

    const time = document.createElement('p');
    time.classList.add('timepost', 'mb-1');
    time.textContent = timepost;

    const details = document.createElement('p');
    details.classList.add('detail', 'mb-0');
    details.textContent = post.details;

    textContainer.appendChild(ownerName);
    textContainer.appendChild(time);
    textContainer.appendChild(details);

    cardContent.appendChild(img);
    cardContent.appendChild(textContainer);

    // Create the bottom section
    const bottomSection = document.createElement('div');
    bottomSection.classList.add('bottom-section', 'd-flex', 'justify-content-between', 'align-items-center', 'mt-3');

    const catInfo = document.createElement('p');
    catInfo.classList.add('catname');
    catInfo.textContent = `${post.catname} ${cat_sex}`;

    const statsContainer = document.createElement('div');
    statsContainer.classList.add('social-button');

    const heartSpan = document.createElement('button');
    heartSpan.classList.add('bt-like', 'me-2');

    // สร้าง Canvas element เพื่อแสดงแอนิเมชัน
    const canvas_like = document.createElement('canvas');
    canvas_like.classList.add('hicon');

    const countLike = document.createElement('p');
    countLike.classList.add('cl');
    countLike.textContent = '2.8k';

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
    commentSpan.innerHTML = '<i class="fa-solid fa-comment"></i> 200';
    statsContainer.appendChild(commentSpan);

    //----------------------------------------------------------------------------

    const bookSpan = document.createElement('button');
    bookSpan.classList.add('bt-bookmark', 'me-2');

    // สร้าง Canvas element เพื่อแสดงแอนิเมชัน
    const canvas_book = document.createElement('canvas');
    canvas_book.classList.add('canBook');
    canvas_book.classList.add('bicon');

    // เพิ่ม canvas และข้อความลงใน heartSpan
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
      new Promise(resolve => lottie_book.addEventListener("load", resolve))


    ]).then(async () => {
      // เช็คว่ามีการ Login ไหม ถ้ามีค่อยเรียกฟังก์ชั่น ไม่งั้นค่าเป็น null แล้วฟังก์ชั่นแจ้ง error
      let user = sessionStorage.getItem("user");
      if (user) {
        const account = await search_account(user);
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
            bh_state = true;
          } else {
            lottie_heart.setFrame(lottie_heart.totalFrames - 30);
            lottie_heart.setMode("reverse");
            lottie_heart.play();
            await deleteStateLike(account.username, post.id);
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
    adoptButton.addEventListener("click", () => {
      crate_popup(post.catname);
    });

    bottomSection.appendChild(catInfo);
    bottomSection.appendChild(statsContainer);
    bottomSection.appendChild(adoptButton);

    // Append everything to the card
    card.appendChild(cardContent);
    card.appendChild(bottomSection);

    // Append the card to the list container
    catListElement.appendChild(card);
  });
}


async function crate_popup(catName) {
  // Create header-section
  let fileLst = [];
  const container = document.getElementById('adopt-popup');
  container.style.display = 'block';
  if (container.innerHTML.trim() === '') {
    const closeBtn = document.createElement('i');
    closeBtn.classList.add('close-btn', 'fa-solid', 'fa-xmark');
    closeBtn.onclick = () => {
      container.style.display = 'none';
      container.innerHTML = '';
    };

    const headerSection = document.createElement('div');
    headerSection.classList.add('header-section');
    headerSection.innerHTML = `
        <h1>Do you want to adopt a ${catName} ?</h1>
        <p>Upload your picture and details about you :) </p>
    `;

    // Create drop-section
    const dropSection = document.createElement('div');
    dropSection.classList.add('drop-section');

    // First col in drop-section
    const col1 = document.createElement('div');
    col1.classList.add('col');
    col1.innerHTML = `
        <div class="cloud-icon">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:48px;color: #E09030;"></i>
        </div>
        <span style="font-weight: bold;">Drag and Drop your Picture</span>
        <span style="font-weight: bold;">OR</span>
        <button class="file-selector">Browse Files</button>
        <input type="file" class="file-selector-input" accept="image/*" multiple>
    `;

    // Second col in drop-section
    const col2 = document.createElement('div');
    col2.classList.add('col');
    col2.innerHTML = `<div class="drop-here">Drop here</div>`;

    // Append col1 and col2 to drop-section
    dropSection.appendChild(col1);
    dropSection.appendChild(col2);

    // Create list-section
    const listSection = document.createElement('div');
    listSection.classList.add('list-section');

    // Create list-title and list
    const listTitle = document.createElement('div');
    listTitle.classList.add('list-title');
    listTitle.innerHTML = 'Uploaded Files';

    const list = document.createElement('div');
    list.classList.add('list');

    //button send
    const button = document.createElement('button');
    button.classList.add('adopt-button');
    button.textContent = "Send";
    button.onclick = async () => {
      for (let file of fileLst) {
        try {
          const imageUrl = await uploadImage(file);  // อัปโหลดรูปและรับ URL
          console.log(`Uploaded: ${file.name}, URL: ${imageUrl}`);
          container.style.display = 'none';
          container.innerHTML = '';
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
        }
      }
    }

    // Append list-title and list to list-section
    listSection.appendChild(listTitle);
    listSection.appendChild(list);

    // Append headerSection, dropSection, and listSection to container
    container.appendChild(headerSection);
    container.appendChild(dropSection);
    container.appendChild(listSection);
    container.appendChild(button);
    container.appendChild(closeBtn);

    // Append the entire container to the body
    document.body.appendChild(container);


    const dropArea = document.querySelector('.drop-section');
    const list_Section = document.querySelector('.list-section');
    const listContainer = document.querySelector('.list');
    const fileSelector = document.querySelector('.file-selector');
    const fileSelectorInput = document.querySelector('.file-selector-input');

    // upload files with browse button
    fileSelector.onclick = () => fileSelectorInput.click();
    fileSelectorInput.onchange = () => {
      [...fileSelectorInput.files].forEach((file) => {
        if (typeValidation(file.type)) {
          showFile(file);
        }
      });
    };

    // when file is over the drag area
    dropArea.ondragover = (e) => {
      e.preventDefault();
      [...e.dataTransfer.items].forEach((item) => {
        if (typeValidation(item.type)) {
          dropArea.classList.add('drag-over-effect');
        }
      });
    };

    // when file leave the drag area
    dropArea.ondragleave = () => {
      dropArea.classList.remove('drag-over-effect');
    };

    // when file drop on the drag area
    dropArea.ondrop = (e) => {
      e.preventDefault();
      dropArea.classList.remove('drag-over-effect');
      if (e.dataTransfer.items) {
        [...e.dataTransfer.items].forEach((item) => {
          if (item.kind === 'file') {
            const file = item.getAsFile();
            if (typeValidation(file.type)) {
              showFile(file);
            }
          }
        });
      } else {
        [...e.dataTransfer.files].forEach((file) => {
          if (typeValidation(file.type)) {
            showFile(file);
          }
        });
      }
    };

    // check the file type
    function typeValidation(type) {
      var splitType = type.split('/')[0];
      if (splitType == 'image') {
        return true;
      }
      return false;
    }


    // show file function - show the file name, size, and icon in the list
    function showFile(file) {
      fileLst.push(file);
      list_Section.style.display = 'block';
      var li = document.createElement('li');
      li.classList.add('in-prog');

      // สร้าง Object URL สำหรับแสดงภาพ
      const objectURL = URL.createObjectURL(file);

      li.innerHTML = `
          <div class="col">
              <img src="${objectURL}" style="width: 50px; height: 50px; object-fit: cover;"  alt="${file.name}">
          </div>
          <div class="col">
              <div class="file-name">
                  <div class="name">${file.name}</div>
                  <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)}MB</div>
              </div>
          </div>
          <div class="col">
              <i class="fa-solid fa-xmark cross"></i>
          </div>
      `;
      listContainer.prepend(li);

      // ฟังก์ชันการยกเลิกการแสดงไฟล์
      li.querySelector('.cross').onclick = () => li.remove();
    }
  }

}






