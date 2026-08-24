// ===== LOGIN PAGE JAVASCRIPT =====
(function() {
    "use strict";

    // Clear any existing session on load
    sessionStorage.removeItem('currentUser');

    const USERS = {
        'admin': { password: 'admin123', role: 'Admin', name: 'James' },
        'alice': { password: 'alice123', role: 'Admin', name: 'Alice' },
        'brian': { password: 'brian123', role: 'Sales', name: 'Brian' },
        'cathy': { password: 'cathy123', role: 'Sales', name: 'Cathy' }
    };

    let selectedRole = 'admin';

    window.selectRole = function(role) {
        selectedRole = role;
        const options = document.querySelectorAll('.role-option');
        options.forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.role === role) {
                opt.classList.add('active');
            }
        });
    };

    window.showForgotPassword = function() {
        const error = document.getElementById('loginError');
        error.querySelector('span').textContent = '🔑 Please contact your system administrator to reset your password.';
        error.classList.add('show');
        setTimeout(() => error.classList.remove('show'), 4000);
    };

    // Toggle password visibility
    let passwordVisible = false;
    document.getElementById('togglePassword').addEventListener('click', function() {
        passwordVisible = !passwordVisible;
        const input = document.getElementById('loginPassword');
        input.type = passwordVisible ? 'text' : 'password';
        this.querySelector('i').className = passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
    });

    // Remember me
    const rememberMe = document.getElementById('rememberMe');
    const savedUsername = localStorage.getItem('mutomo_remember_username');
    if (savedUsername) {
        document.getElementById('loginUsername').value = savedUsername;
        rememberMe.checked = true;
    }

    // Form submission
    const loginForm = document.getElementById('loginForm');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const loginSuccess = document.getElementById('loginSuccess');
    const loginBtn = document.getElementById('loginBtn');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        loginBtn.classList.add('loading');
        loginBtn.querySelector('.btn-text').textContent = 'Authenticating...';

        setTimeout(() => {
            const user = USERS[username.toLowerCase()];

            if (user && user.password === password) {
                const userRole = user.role.toLowerCase();
                if (userRole !== selectedRole) {
                    loginError.querySelector('span').textContent =
                        `⛔ This account is not a ${selectedRole === 'admin' ? 'Administrator' : 'Sales Person'} account. Please select the correct role.`;
                    loginError.classList.add('show');
                    loginSuccess.classList.remove('show');
                    loginBtn.classList.remove('loading');
                    loginBtn.querySelector('.btn-text').textContent = 'Login';
                    setTimeout(() => loginError.classList.remove('show'), 4000);
                    return;
                }

                if (rememberMe.checked) {
                    localStorage.setItem('mutomo_remember_username', username);
                } else {
                    localStorage.removeItem('mutomo_remember_username');
                }

                loginError.classList.remove('show');
                loginSuccess.classList.add('show');
                
                // Store user session
                sessionStorage.setItem('currentUser', JSON.stringify({ username, ...user }));
                
                // Redirect based on role
                if (user.role === 'Admin') {
                    loginSuccess.querySelector('span').textContent = `✅ Welcome Admin, ${user.name}! Redirecting to Admin Dashboard...`;
                    setTimeout(() => {
                        window.location.href = 'dashboard-admin.html';
                    }, 1500);
                } else {
                    loginSuccess.querySelector('span').textContent = `✅ Welcome Sales Person, ${user.name}! Redirecting to Sales Dashboard...`;
                    setTimeout(() => {
                        window.location.href = 'dashboard-sales.html';
                    }, 1500);
                }
                
                loginBtn.classList.remove('loading');
                loginBtn.querySelector('.btn-text').textContent = 'Login';
            } else {
                loginError.querySelector('span').textContent = '❌ Invalid username or password. Please try again.';
                loginError.classList.add('show');
                loginSuccess.classList.remove('show');
                loginBtn.classList.remove('loading');
                loginBtn.querySelector('.btn-text').textContent = 'Login';
                setTimeout(() => loginError.classList.remove('show'), 4000);
            }
        }, 800);
    });

    // Enter key shortcuts
    loginPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginForm.dispatchEvent(new Event('submit'));
    });

    loginUsername.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loginPassword.focus();
    });

    console.log('🔐 Login page loaded - ready for login');
})();
