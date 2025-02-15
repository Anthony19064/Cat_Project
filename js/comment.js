document.addEventListener("DOMContentLoaded", () => {
    const commentpopOpen = document.getElementById("commentpop-open");
    const commentpopClose = document.getElementById("commentpop-close");
    const commentpopPopup = document.getElementById("commentpop-popup");

    // เปิดป๊อปอัป
    commentpopOpen.addEventListener("click", () => {
        commentpopPopup.style.display = "flex";
    });

    // ปิดป๊อปอัป
    commentpopClose.addEventListener("click", () => {
        commentpopPopup.style.display = "none";
    });

    // ปิดป๊อปอัปเมื่อคลิกด้านนอก
    commentpopPopup.addEventListener("click", (e) => {
        if (e.target === commentpopPopup) {
            commentpopPopup.style.display = "none";
        }
    });
});
