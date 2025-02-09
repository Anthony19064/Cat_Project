function toggleForms() {
    const container = document.querySelector('.container-fluid');
    const formContainer = document.getElementById('form-container');

    container.classList.toggle('flipped');

    setTimeout(() => {
        if (container.classList.contains('flipped')) {
            // เปลี่ยนเป็น Register Form
            formContainer.innerHTML = `
                <div class="register-form">
                    <div class="avatar"></div>
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
                    <div class="mb-3 position-relative">
                        <span class="input-group-text"><i class="fa-solid fa-comment"></i></span>
                        <input type="text" class="form-control" placeholder="Social media contract" id="contract">
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
                    
                    <button type="submit" class="btn btn-register" onclick="">Register</button>
                    <button type="button" class="btn btn-cancel" onclick="toggleForms()">Cancel</button>
                </form>
                   
                </div>
            `;
        } else {
            location.reload();
        }
    },400);
}



function test(){
    console.log('test');
    toggleForms();
}
