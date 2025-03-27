

// โค้ดedit profile popup
document.addEventListener("DOMContentLoaded", function () {
    const editBtn = document.querySelector(".edit-profile-btn");
    const popup = document.getElementById("editProfilePopup");
    const overlay = document.getElementById("editProfileOverlay");
    const closeBtn = document.querySelector(".edit-profile-close");

    // เปิด Popup
    editBtn.addEventListener("click", function () {
        popup.style.display = "flex";
        overlay.style.display = "flex ";
    });

    // ปิด Popup
    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
    });

    // ปิด Popup เมื่อคลิกที่ Overlay
    overlay.addEventListener("click", function () {
        popup.style.display = "none";
        overlay.style.display = "none";
    });
});

function updateSocialIcon() {
    const select = document.getElementById("socialMediaSelect");
    const icon = document.getElementById("socialIcon");
    const selectedValue = select.value;

    // กำหนดไอคอนของแต่ละแพลตฟอร์ม
    const iconClasses = {
        line: "fa-line",
        facebook: "fa-facebook",
        instagram: "fa-instagram"
    };

    // ลบไอคอนเก่าทิ้งทั้งหมด
    icon.className = "fa-brands"; 

    // เพิ่มไอคอนใหม่ที่เลือก
    if (iconClasses[selectedValue]) {
        icon.classList.add(iconClasses[selectedValue]);
    }
}
