// Import Firebase SDK from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, where, query, setDoc, or, and } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";


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

// Fetch cat data from Firestore
async function getCatData() {
  const Cat = collection(db, 'Cat-details');
  const catSnapshot = await getDocs(Cat);
  return catSnapshot.docs.map(doc => doc.data());
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
      return userData.username; 
    }
  } catch (error) {
    console.error("Error searching account:", error);
  }
  return false;
}




export async function register(username, phone, password, name, mail, contract) {
  try{
    const docRef = await addDoc(collection(db, "Account"), {
      name: name,
      phone: phone,
      contract: contract,
      username: username,
      password: password,
      mail: mail,
      
    });
    console.log("Account added with ID: ", docRef.id);
  }catch(e){
    console.error("Error adding cat: ", e);
  }
}


async function addCatData(catName, catSex, catLocation, catImg, catDetails) {
  try {
    const docRef = await addDoc(collection(db, "Cat-details"), {}); // สร้าง document เปล่าก่อน เพื่อให้ได้ docRef.id
    
    await setDoc(docRef, {  // ใช้ setDoc เพื่ออัปเดตข้อมูลพร้อม id
      id: docRef.id,  // บันทึก document ID ลงไปใน field
      name: catName,
      sex: catSex,
      location: catLocation,
      img: catImg,
      details: catDetails
    });

    console.log("Cat added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding cat: ", e);
  }
}




// Render data on the page
export async function displayCats() {
  const catListElement = document.querySelector('#catList');
  const cats = await getCatData();



  cats.forEach(cat => {
    // Create a new card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem'; // Set card width
    card.dataset.id = cat.id;

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = cat.img;
    // Create card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // Create card title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = cat.name; // Set name as card title

    // Create card subtitle (e.g., Sex or Location)
    const cardSubtitle = document.createElement('h6');
    cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-muted');
    cardSubtitle.textContent = `Sex: ${cat.sex} | Location: ${cat.location}`; // Sex and Location as subtitle

    // Create card text (Description or extra info)
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = cat.details; // Customize this text as needed

    // Create card links (optional)
    const cardLink1 = document.createElement('button');
    cardLink1.classList.add('btn', 'btn-outline-warning');
    cardLink1.textContent = 'Comment'; // Customize link text

    cardLink1.onclick = async function (event) {
      event.preventDefault(); // ป้องกันการเปลี่ยนหน้า
      const popupText = document.getElementById('popup-text');
      popupText.innerHTML = ''; 
      const comments = await getCommenttData();  // ดึงข้อมูล ฐานข้อมูล comment
      // loop ฐานข้อมูล comment
      comments.forEach(commentData => { 
          if (commentData.id == cat.id) {
              const commentElement = document.createElement('p'); 
              commentElement.textContent = commentData.txt; 
              popupText.appendChild(commentElement);
          }
      });
      document.getElementById('popup').style.display = 'flex'; //แสดง popup
    };
    //  ปิด Popup
    document.getElementById('close-popup').onclick = function () {
      document.getElementById('popup').style.display = 'none';
  };


    // Append all elements to the card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubtitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardLink1);

    // Append the card to the catList element
    card.appendChild(img);
    card.appendChild(cardBody);
    catListElement.appendChild(card);
  });

}






