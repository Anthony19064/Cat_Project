// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3D8w5hAidJnwAybd_AEZoBFKDtjSl0UU",
    authDomain: "catprojectce.firebaseapp.com",
    databaseURL: "https://catprojectce-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "catprojectce",
    storageBucket: "catprojectce.firebasestorage.app",
    messagingSenderId: "128805338272",
    appId: "1:128805338272:web:fd50c8bc8f73bef823ddc5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ฟังก์ชันส่งข้อความแชทไปยัง Firebase
function sendMessage(username, message) {
    const chatRef = firebase.database().ref('chat/');
    chatRef.push({
        username: username,
        message: message,
        timestamp: new Date().toLocaleString()
    }).then(() => {
        console.log('✅ Message sent!');
    }).catch((error) => {
        console.error('❌ Error sending message:', error);
    });
}

// ฟังก์ชันดึงข้อความแชทและอัปเดตแบบ Real-time
function listenForMessages() {
    const chatRef = firebase.database().ref('chat/');
    chatRef.on('child_added', (snapshot) => {
        const data = snapshot.val();
        displayMessage(data);
    });
}

// ฟังก์ชันแสดงข้อความแชทบนหน้าเว็บ
function displayMessage(data) {
    const chatList = document.getElementById('chatList');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `<strong>${data.username}:</strong> ${data.message} <span class="text-muted" style="float:right;">${data.timestamp}</span>`;
    chatList.appendChild(listItem);

    // เลื่อนให้เห็นข้อความล่าสุด
    chatList.scrollTop = chatList.scrollHeight;
}

// จัดการ Submit Form ส่งข้อความแชท
document.getElementById('chatForm').addEventListener('submit', (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;

    sendMessage(username, message);

    // ล้างช่องกรอกข้อความ
    document.getElementById('message').value = '';
});

// เริ่มฟังข้อความแชทแบบ Real-time เมื่อโหลดหน้าเสร็จ
window.onload = () => {
    listenForMessages();
};
