// ===== ADMIN DASHBOARD JAVASCRIPT =====
(function() {
    "use strict";

    // ===== CHECK SESSION =====
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const data = JSON.parse(user);
        if (data.role !== 'Admin') {
            window.location.href = 'dashboard-sales.html';
            return;
        }
        document.getElementById('adminName').textContent = data.name || 'James';
    } catch(e) {
        window.location.href = 'index.html';
        return;
    }

    // ===== LOGOUT - CLEAR SESSION =====
    document.getElementById('adminLogout').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('🚪 Are you sure you want to logout?')) {
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('mutomo_remember_username');
            window.location.href = 'index.html';
        }
    });

    // ===== MENU ITEMS =====
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            alert('📄 ' + this.textContent.trim() + ' page would load');
        });
    });

    // ===== ADD EMPLOYEE =====
    document.querySelector('.btn-blue.btn-block')?.addEventListener('click', function() {
        alert('👤 Add Employee form would open');
    });

    console.log('🛡️ Admin Dashboard loaded');
})();
