// Import Firebase SDK from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";

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

// Render data on the page
// Render data on the page
export async function displayCats() {
  const catListElement = document.querySelector('#catList');
  const cats = await getCatData();

  cats.forEach(cat => {
    // Create a new card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem'; // Set card width

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
    const cardLink1 = document.createElement('a');
    cardLink1.href = '#';
    cardLink1.classList.add('card-link');
    cardLink1.textContent = 'Card link'; // Customize link text

    const cardLink2 = document.createElement('a');
    cardLink2.href = '#';
    cardLink2.classList.add('card-link');
    cardLink2.textContent = 'Another link'; // Customize link text

    // Append all elements to the card body
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubtitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardLink1);
    cardBody.appendChild(cardLink2);

    // Append the card to the catList element
    card.appendChild(img);
    card.appendChild(cardBody);
    catListElement.appendChild(card);
  });

}

