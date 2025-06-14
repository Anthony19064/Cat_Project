import { search_accountByid} from "./db.js";

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

export async function sendNotification(postId, toUser, type, fromUser) {
    const fUser = await search_accountByid(fromUser);
    const notificationRef = firebase.database().ref(`notifications/${toUser}`);

    // ค้นหา Notification อันเดิมที่มาจากผู้ใช้คนเดิม
    const query = notificationRef.orderByChild('postId').equalTo(postId);
    query.once('value', async (snapshot) => {
        let notificationExists = false;
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (type == "like" || type == "bookmark"){
                if (data.type === type && data.from == fromUser) {
                    // ถ้าเจอ Notification แบบเดิม ให้ลบออก
                    childSnapshot.ref.remove();
                    console.log('🗑️ Notification removed!');
                    notificationExists = true;
                }
            }
            
        });

        if (!notificationExists) {
            // ถ้าไม่เจอ Notification แบบเดิม ให้สร้าง Notification ใหม่
            notificationRef.push({
                postId: postId,
                userImage: fUser.img,
                type: type,
                from: fromUser,
                isRead: false,
                timestamp: Date.now(),
            }).then(() => {
                console.log('✅ Notification sent!');
            }).catch((error) => {
                console.error('❌ Error sending notification:', error);
            });
        }
    });
}


export async function displayNotification(userId) {
    const notificationRef = firebase.database().ref(`notifications/${userId}`)
        .orderByChild('timestamp')
        .limitToLast(6); // ดึงข้อมูล 10 รายการล่าสุด
    const notiContainer = document.getElementById("notiContainer");
    notiContainer.innerHTML = "";
    // เมื่อมีการเปลี่ยนแปลงข้อมูล (ทั้งเพิ่มและลบ)
    notificationRef.on('value', async (snapshot) => {
        const notifications = [];

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            notifications.push({ key: childSnapshot.key, ...data });
        });
        

        // เรียงข้อมูลจาก "ล่าสุดไปเก่าสุด" โดยใช้ timestamp
        notifications.sort((a, b) => b.timestamp - a.timestamp);

        notiContainer.innerHTML = ""; // เคลียร์ UI
        for (const data of notifications) {
            const notiDot = document.getElementById("notification-dot");
            if(data.isRead == false){
                notiDot.style.opacity = 1;
            }        
        }

        
        for (const data of notifications) {
            const fUser = await search_accountByid(data.from);

            const notification = document.createElement("div");
            notification.classList.add("noticontainer");
            notification.setAttribute("data-id", data.key); // เก็บ Key ของ Firebase ไว้ใน DOM

            const iconNoti = document.createElement("i");
            const image = document.createElement("img");
            image.classList.add("notiImg");
            image.src = fUser.img;

            const imgSection = document.createElement('div');
            imgSection.classList.add('imgSection');
            imgSection.appendChild(image);

            let valueType = "";
            let endtext = "";
            let phone = "";
            let contract = "";
            if (data.type === "like") {
                iconNoti.classList.add("fa-solid", "fa-heart");
                iconNoti.style.color = "#FA3B3B";
                notification.style.backgroundColor = "#FA3B3B";
                valueType = "กดถูกใจ";
                endtext = "โพสของคุณ";
            }
            else if (data.type === "comment") {
                iconNoti.classList.add("fa-solid", "fa-comment-dots");
                iconNoti.style.color = "#E09030";
                notification.style.backgroundColor = "#E09030";
                valueType = "แสดงความคิดเห็น";
                endtext = "บนโพสของคุณ";
            }
            else if (data.type === "bookmark") {
                iconNoti.classList.add("fa-solid", "fa-bookmark");
                iconNoti.style.color = "#2e7eff";
                notification.style.backgroundColor = "#2e7eff";
                valueType = "บันทึก";
                endtext = "โพสของคุณ";
            } else if (data.type === "adopt") {
                iconNoti.classList.add("fa-solid", "fa-paw");
                iconNoti.style.color = "#8bb05b";
                notification.style.backgroundColor = "#8bb05b";
                valueType = "ส่งคำขอ";
                endtext = "ถึงคุณ";
            }else if (data.type === "confirm") {
                iconNoti.classList.add("fa-solid", "fa-check");
                iconNoti.style.color = "#0a8f00";
                notification.style.backgroundColor = "white";
                notification.style.borderColor = "#0a8f00";
                notification.style.color = "#0a8f00";
                image.style.borderColor = "#0a8f00";
                valueType = "ยอมรับคำขอ";
                endtext = "ของคุณ";
                phone = fUser.phone;
                contract = fUser.contract;

                
            }else if (data.type === "cancel") {
                iconNoti.classList.add("fa-solid", "fa-xmark");
                iconNoti.style.color = "#ff0000";
                notification.style.backgroundColor = "white";
                notification.style.borderColor = "#ff0000";
                notification.style.color = "#ff0000";
                image.style.borderColor = "#ff0000";
                valueType = "ปฏิเสธคำขอ";
                endtext = "ของคุณ";
            }

            imgSection.appendChild(iconNoti);
            notification.appendChild(imgSection);

            const account = await search_accountByid(data.from);
            const textNode = document.createElement('span');
            textNode.classList.add('noticontent');
            
            const noticontent = document.createElement('p');
            noticontent.style.margin = "0px";
            noticontent.innerHTML = ` <span class="sp1">${account.username}</span> <span>${valueType}${endtext}</span>`;

            const noticontent2 = document.createElement('p');
            noticontent2.style.margin = "0px";
            noticontent2.style.marginTop = "3px";
            noticontent2.innerHTML = `<span>ติดต่อกลับที่ช่องทางดังนี้</span> <br>tel. ${phone}<br> <span>${contract}</span>`;

            textNode.appendChild(noticontent);
            if(phone && contract){
                textNode.appendChild(noticontent2);
            }

            notification.appendChild(textNode);

            notiContainer.appendChild(notification);
        }
    });

    // เมื่อมีการลบ Notification ออก
    notificationRef.on('child_removed', (snapshot) => {
        const notification = notiContainer.querySelector(`[data-id="${snapshot.key}"]`);
        if (notification) {
            notification.remove(); // ลบออกจาก DOM
            console.log(`🗑️ Notification ${snapshot.key} removed from UI!`);
        }
    });

}


export async function check_stateNoti(userId) {
    const notificationRef = firebase.database().ref(`notifications/${userId}`)

     notificationRef.once('value', async (snapshot) => {
        const updates = {};

        snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            updates[`${key}/isRead`] = true; // ตั้งค่า isRead ของทุก Notification เป็น true
        });
        const notiDot = document.getElementById("notification-dot");
        notiDot.style.opacity = 0;
        if (Object.keys(updates).length > 0) {

            await firebase.database().ref(`notifications/${userId}`).update(updates);
            console.log("อัปเดตข้อมูลเรียบร้อยแล้ว");
        } else {
            console.log("ไม่มี Notification ที่จะอัปเดต");
        }
    });
}
