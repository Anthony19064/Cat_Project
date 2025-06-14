function toggleForms() {
    const container = document.querySelector('.container-fluid');
    const formContainer = document.getElementById('form-container');
    const left = document.getElementById('left');

    container.classList.toggle('flipped');
    
    setTimeout(() => {
        if (container.classList.contains('flipped')) {
            // เปลี่ยนเป็น Register Form
            formContainer.innerHTML = `
                <div class="register-form">
                    <label for="avatar-input" class="avatar-label">
                        <div class="avatar" id="avatar-preview"></div>
                    </label>
                    <input type="file" id="avatar-input" accept="image/*" style="display: none" onchange="previewAvatar()">
                    <h3>Register</h3>
                    <form id="regis-form">
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                            <input type="text" class="form-control" placeholder="Name" id="name">
                        </div>
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-phone"></i></span>
                            <input type="text" class="form-control" placeholder="Phone number" id="phone">
                        </div>
                        <div class="mb-3 position-relative d-flex">
                            <span class="input-group-text" id="contact-icon"><i class="fa-brands fa-facebook"></i></span>
                            <select class="form-select custom-dropdown" id="contract-type" onchange="updateIcon()">
                                <option value="FB" selected>Facebook</option>
                                <option value="LINE" >Line</option>
                                <option value="IG">Instagram</option>
                            </select>
                            <input type="text" class="form-control" placeholder="Social media" id="contract-t">
                        </div>
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                            <input type="email" class="form-control" placeholder="Email" id="mail">
                        </div>
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                            <input type="text" class="form-control" placeholder="Username" id="username">
                        </div>
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                            <input type="password" class="form-control" placeholder="Password" id="password">
                        </div>
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                            <input type="password" class="form-control" placeholder="Retype password" id="retype_password">
                        </div>
                        
                        <button type="submit" class="btn btn-register">Register</button>
                        <button type="button" class="btn btn-cancel" onclick="toggleForms()">Cancel</button>
                    </form>
                </div>
            `;
        } else {
            formContainer.innerHTML = `<div class="login-form">
                    <div class="closebutton" onclick="window.location.href = '../html/index.html'">
                        <i class="fa-solid fa-xmark fa-2xl" style="color: #E09030;"></i>
                    </div>
                    <img src="https://firebasestorage.googleapis.com/v0/b/catprojectce.firebasestorage.app/o/imageInWeb%2Flogo.jpg?alt=media&token=71cdda40-848e-4cc6-9c7c-a31b2329f07e"
                        class="avatar"></img>
                    <h3>Login</h3>
                    <form id="loginForm">
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-user"></i></span>
                            <input type="text" class="form-control" id="username" placeholder="Username or Email">
                        </div>
                        <div class="mb-3 position-relative">
                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                            <input type="password" class="form-control" id="password" placeholder="Password">
                        </div>
                        <button type="submit" class="btn btn-login">Login</button>
                    </form>
                    <div class="toggle-link" onclick="toggleForms()">Don't have an account? Register</div>
                </div>`;
        }
        
    }, 400);
}

function updateIcon() {
    const select = document.getElementById("contract-type");
    const iconSpan = document.getElementById("contact-icon");

    const icons = {
        FB: "fa-brands fa-facebook",
        LINE: "fa-brands fa-line",
        IG: "fa-brands fa-instagram"
    };

    // อัปเดตไอคอนตามค่าที่เลือก
    iconSpan.innerHTML = `<i class="${icons[select.value]}"></i>`;
}

function previewAvatar() {
    const file = document.getElementById("avatar-input").files[0];
    const preview = document.getElementById("avatar-preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.style.backgroundSize = "cover";
            preview.style.backgroundPosition = "center";
            preview.style.border = "none";
        };
        reader.readAsDataURL(file);
    }
}
