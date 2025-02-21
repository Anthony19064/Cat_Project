// โหลด navbar จากไฟล์ภายนอก (navbar.html)
fetch('layout.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;

        // ตรวจสอบการล็อกอินใน sessionStorage
        const user = sessionStorage.getItem("user");
        const loginBtn = document.getElementById("login-btn");
        const userProfile = document.getElementById("user-profile");
        const userName = document.getElementById("user-name");
        const logoutBtn = document.getElementById("logout-btn");

        if (user) {
            loginBtn.style.display = "none";
            userProfile.classList.remove("d-none");
            userName.textContent = user;
        } else {
            loginBtn.style.display = "block";
            userProfile.classList.add("d-none");
        }

        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("user");
            window.location.href = "index.html"; // เปลี่ยนไปหน้า Login
        });
    });