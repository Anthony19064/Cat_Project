const buttons = document.querySelectorAll('.nav-post, .nav-request, .nav-book');
const contentContainer = document.getElementById('content');

// เนื้อหาต่างๆ ที่จะเปลี่ยนแปลง
const contentData = {
    post: `
 <div class="card cat-card mb-3">
<div class="d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center">
        <img class="cat-img me-3"
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzhkaDNqeTJjZDhiZzcwdXJjOHB0ZW05MnVxZG03Zmxyd3JpNTJtNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/CjmvTCZf2U3p09Cn0h/giphy.gif"
            alt="Cat Image">
        <div class="top-right">
            <p class="location"><span>Bangkok</span><span class="catnameMobile"> | Fluffy ♂</span></p>
            <p class="timepost mb-1">2h ago</p>
            <p class="detail mb-0">A cute and friendly cat looking for a new home!</p>
        </div>
    </div>

    
    <div class="menu-container">
        <div class="menu-icon" onclick="toggleDropdown()">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>

        
        <div class="dropdown-menu" id="dropdownMenu">
            <p onclick="alert('Edit Clicked')">Edit</p>
            <p onclick="alert('Delete Clicked')">Delete</p>
            <p onclick="alert('Share Clicked')">Share</p>
        </div>
    </div>
</div>

<div class="bottom-section d-flex justify-content-between align-items-center mt-3">
    <p class="catname">Fluffy ♂</p>

    <div class="social-button">
        <button class="bt-like me-2">
            <canvas class="hicon"></canvas>
            <p class="cl">2.8k</p>
        </button>
        <button class="bt-comment" id="commentpop-open">
            <i class="fa-solid fa-comment"></i> 200
        </button>
        <button class="bt-bookmark me-2">
            <canvas class="canBook bicon"></canvas>
        </button>
    </div>

    <button class="btn adopt-btn">ADOPT</button>
</div>
</div>
`,
    request: `
<div class="card request-card mb-3">
    <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
            <img class="request-img me-3"
                src="https://scontent.fbkk5-7.fna.fbcdn.net/v/t1.15752-9/472933764_944836604362216_7115759838709685415_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_ohc=ZBxz7Uo8n_oQ7kNvgFZTuCY&_nc_oc=AdgJ0BYNG4rZeX82sMhb7mSocsfyznB9QEd3DyW8LeMEdGn8iaq3egsVdFtuzWnKlN0&_nc_zt=23&_nc_ht=scontent.fbkk5-7.fna&oh=03_Q7cD1gFqBNr38hf03z5HA3QWiDVtKnKtYI5Uttcp7neUpdLb7w&oe=67E1A42F"
                alt="Request Image">
            <div class="request-info">
                <p class="request-user"><span>Username</span><span class="request-name-mobile"></span></p>
                <p class="request-time mb-1">2h ago</p>
                <p class="request-detail mb-0">A cute and friendly cat looking for a new home!</p>
            </div>
        </div>
    </div>
    <div class="request-actions d-flex justify-content-between align-items-center mt-3">
        <button class="btn request-btn">View Detail</button>
    </div>
</div>

<div id="request-popup" class="request-popup">
    <div class="request-popup-content">
        <span class="request-popup-close">&times;</span>
        <h2 class="request-popup-title">confirm cat adoption</h2>

       <div id="carouselExampleIndicators" class="carousel slide">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.15752-9/462652070_1638876876715835_372003700109994604_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=9f807c&_nc_ohc=tDmuM6_ncQAQ7kNvgEQdvAc&_nc_oc=AdipEhx5ZmKFt9EK_u7RvT0P5_DEUqipZ_9fgqj_8w1gTacr3n1TI-epn63GD69uF2Y&_nc_zt=23&_nc_ht=scontent.fbkk5-1.fna&oh=03_Q7cD1gHC9GRXfYcynllHAfh5MKuHmOhhaeC3xqUCaVLa3xTI6g&oe=67E3F2A0" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="https://scontent.fbkk5-7.fna.fbcdn.net/v/t1.15752-9/472933764_944836604362216_7115759838709685415_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_ohc=ZBxz7Uo8n_oQ7kNvgFZTuCY&_nc_oc=AdgJ0BYNG4rZeX82sMhb7mSocsfyznB9QEd3DyW8LeMEdGn8iaq3egsVdFtuzWnKlN0&_nc_zt=23&_nc_ht=scontent.fbkk5-7.fna&oh=03_Q7cD1gGOAX2zarHX60MRtCKWXuUnOUHiwx59pQnc-orWpJxspQ&oe=67E40EEF" class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="https://scontent.fbkk5-1.fna.fbcdn.net/v/t1.15752-9/465003794_1622186582060515_2250672388911587959_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=9f807c&_nc_ohc=ytDVUmiS0foQ7kNvgFlN9WJ&_nc_oc=AdjjFTE1RHmRWS7nZrNUdqsaAhnZGysCV7jKoq5xt19K3aHIOxtyrg8y-0MaApcuyhE&_nc_zt=23&_nc_ht=scontent.fbkk5-1.fna&oh=03_Q7cD1gELetuHQokM0b4FWnqZNccJAZwEnJlzF4Q7v_jSWfY70A&oe=67E41373" class="d-block w-100" alt="...">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>


        <textarea class="request-popup-details" placeholder="Details about user  ex. name, tel., address, social media, more details"></textarea>

        <div class="request-popup-actions">
            <button class="request-popup-approve">Approve</button>
            <button class="request-popup-decline">Decline</button>
        </div>
    </div>
</div>


`,
    bookmark: `
<div class="card cat-card mb-3">
<div class="d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center">
        <img class="cat-img me-3"
            src="https://firebasestorage.googleapis.com/v0/b/catprojectce.firebasestorage.app/o/imageInWeb%2Fpic1.jpg?alt=media&token=c655521e-48ff-4c2f-bb85-0fa1945f07e8"
            alt="Cat Image">
        <div class="top-right">
            <p class="location"><span>Chonburi</span><span class="catnameMobile"> | Fluffy ♂</span></p>
            <p class="timepost mb-1">2h ago</p>
            <p class="detail mb-0">A cute and friendly cat looking for a new home!</p>
        </div>
    </div>

    
    <div class="menu-container">
        <div class="menu-icon" onclick="toggleDropdown()">
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>

        
        <div class="dropdown-menu" id="dropdownMenu">
            <p onclick="alert('Edit Clicked')">Edit</p>
            <p onclick="alert('Delete Clicked')">Delete</p>
            <p onclick="alert('Share Clicked')">Share</p>
        </div>
    </div>
</div>

<div class="bottom-section d-flex justify-content-between align-items-center mt-3">
    <p class="catname">Rushford ♂</p>

    <div class="social-button">
        <button class="bt-like me-2">
            <canvas class="hicon"></canvas>
            <p class="cl">2.8k</p>
        </button>
        <button class="bt-comment" id="commentpop-open">
            <i class="fa-solid fa-comment"></i> 200
        </button>
        <button class="bt-bookmark me-2">
            <canvas class="canBook bicon"></canvas>
        </button>
    </div>

    <button class="btn adopt-btn">ADOPT</button>
</div>
</div>
`
};

// เพิ่ม event listener สำหรับการคลิก
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const contentType = button.getAttribute('data-content');

        // เปลี่ยนเนื้อหาของ content-container
        contentContainer.innerHTML = contentData[contentType];
    });
});

// request popup
document.addEventListener("click", function (event) {
    let popup = document.getElementById("request-popup");

    // กดปุ่ม "View Detail" เพื่อเปิด popup
    if (event.target.classList.contains("request-btn")) {
        popup.style.display = "flex";
    }

    // กดปุ่มปิด (×) หรือคลิกที่พื้นหลัง popup เพื่อปิด
    if (event.target.classList.contains("request-popup-close") || event.target.id === "request-popup") {
        popup.style.display = "none";
    }
});

// โค้ดedit profile popup
document.addEventListener("DOMContentLoaded", function () {
    const editBtn = document.querySelector(".edit-profile-btn");
    const popup = document.getElementById("editProfilePopup");
    const overlay = document.getElementById("editProfileOverlay");
    const closeBtn = document.querySelector(".edit-profile-close");

    // เปิด Popup
    editBtn.addEventListener("click", function () {
        popup.style.display = "block";
        overlay.style.display = "block";
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
