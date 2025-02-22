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

// ฟังก์ชันส่ง Notification ไปยัง User เป้าหมาย
function sendNotification(toUser, type, message, fromUser = "system") {
    const notificationRef = firebase.database().ref(`notifications/${toUser}`);
    notificationRef.push({
        type: type,
        from: fromUser,
        message: message,
        timestamp: new Date().toLocaleString(),
        isRead: false
    }).then(() => {
        console.log('✅ Notification sent!');
    }).catch((error) => {
        console.error('❌ Error sending notification:', error);
    });
}

// ฟังก์ชันรับ Notification แบบเรียลไทม์
function listenForNotifications(userId) {
    const notificationRef = firebase.database().ref(`notifications/${userId}`);
    notificationRef.on('child_added', (snapshot) => {
        const data = snapshot.val();
        displayNotification(data);
    });
}

function displayNotification(data) {
    const notificationList = document.getElementById('notificationList');
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    
    // ตรวจสอบประเภท Notification และตั้งค่า Background Color
    if (data.type === 'like') {
        listItem.style.backgroundColor = '#f8d7da'; // สีแดงอ่อน (Bootstrap Danger)
        listItem.style.color = '#721c24'; // ตัวหนังสือสีเข้มให้ Contrast กัน
    } else if (data.type === 'comment') {
        listItem.style.backgroundColor = '#d1ecf1'; // สีฟ้าอ่อน (Bootstrap Info)
        listItem.style.color = '#0c5460';
    } else if (data.type === 'follow') {
        listItem.style.backgroundColor = '#d4edda'; // สีเขียวอ่อน (Bootstrap Success)
        listItem.style.color = '#155724';
    }

    listItem.innerHTML = `
        <strong>${data.type.toUpperCase()}:</strong> ${data.message} 
        <span class="text-muted" style="float:right;">${data.timestamp}</span>
    `;
    
    notificationList.appendChild(listItem);

    // เลื่อนให้เห็นข้อความล่าสุด
    notificationList.scrollTop = notificationList.scrollHeight;
}

// จัดการการส่ง Notification เมื่อกดปุ่ม
document.getElementById('sendNotiBtn').addEventListener('click', () => {
    const toUser = document.getElementById('toUser').value;
    const notiType = document.getElementById('notiType').value;
    const message = document.getElementById('message').value;

    if (toUser && notiType && message) {
        sendNotification(toUser, notiType, message);
    } else {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
    }
});

// เริ่มฟัง Notification สำหรับ User ID ที่ต้องการ (แก้ไขตาม UID จริง)
window.onload = () => {
    listenForNotifications('vanessa'); // เปลี่ยน 'user1' เป็น UID ของผู้ใช้ปัจจุบัน
};
