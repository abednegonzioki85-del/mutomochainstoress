// In login.html, change the redirect:
if (userRole === 'Admin') {
    window.location.href = 'dashboard-admin.html';
} else {
    window.location.href = 'dashboard-sales.html';
}
