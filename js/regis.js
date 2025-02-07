function toggleForms() {
    const container = document.querySelector('.container-fluid');
    const formContainer = document.getElementById('form-container');

    container.classList.toggle('flipped'); // เพิ่ม class เพื่อให้เกิด animation

    setTimeout(() => {
        formContainer.classList.add('hidden'); // ทำให้ฟอร์มหายไปก่อนเปลี่ยน
        setTimeout(() => {
            if (container.classList.contains('flipped')) {
                formContainer.innerHTML = `
                    <div class="register-form fade-in">
                        <div class="avatar"></div>
                        <h3>Register</h3>
                        <form>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-user"></i></span>
                                <input type="text" class="form-control" placeholder="Firstname">
                            </div>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-user"></i></span>
                                <input type="text" class="form-control" placeholder="Lastname">
                            </div>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-phone"></i></span>
                                <input type="number" class="form-control" placeholder="Tel.">
                            </div>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-map-marker"></i></span>
                                <input type="text" class="form-control" placeholder="Address">
                            </div>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                <input type="email" class="form-control" placeholder="Email">
                            </div>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                                <input type="text" class="form-control" placeholder="Username">
                            </div>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                <input type="password" class="form-control" placeholder="Password">
                            </div>
                            <button type="submit" class="btn btn-register">Register</button>
                        </form>
                        <div class="toggle-link" onclick="toggleForms()">Already have an account? Login</div>
                    </div>
                `;
            } else {
                formContainer.innerHTML = `
                    <div class="login-form fade-in">
                        <div class="avatar"></div>
                        <h3>Login</h3>
                        <form>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-user"></i></span>
                                <input type="text" class="form-control" placeholder="Username">
                            </div>
                            <div class="mb-3 position-relative">
                                <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                <input type="password" class="form-control" placeholder="Password">
                            </div>
                            <button type="submit" class="btn btn-login">Login</button>
                            <button type="button" class="btn btn-cancel">Cancel</button>
                        </form>
                        <div class="toggle-link" onclick="toggleForms()">Don't have an account? Register</div>
                    </div>
                `;
            }
            formContainer.classList.remove('hidden'); // แสดงฟอร์มใหม่แบบ smooth
        }, 300);
    }, 300);
}
