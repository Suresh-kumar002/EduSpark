const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
});

const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');
const forgotLink = document.querySelector('.forgot-link a');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;

    const result = await loginUser({ username, password });

    if (!result.success) {
        loginMessage.textContent = result.message;
        return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedUser', JSON.stringify(result.user));

    window.location.href = '../Dashboard/index.html';
});

forgotLink.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = prompt('Enter your registered email for password reset:');
    if (!email) return;

    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;

    const result = await forgotPassword({ email, newPassword });
    alert(result.message);
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = registerForm.reg_username.value.trim();
    const email = registerForm.reg_email.value.trim();
    const password = registerForm.reg_password.value;

    const result = await registerUser({ username, email, password });

    registerMessage.textContent = result.message;
    registerMessage.style.color = result.success ? '#0a0' : '#f00';

    if (result.success) {
        setTimeout(() => {
            container.classList.remove('active');
            loginMessage.textContent = 'Registration completed. Please login with your credentials.';
            registerMessage.textContent = '';
            registerForm.reset();
        }, 1200);
    }
});