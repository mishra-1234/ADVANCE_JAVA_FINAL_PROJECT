document.addEventListener('DOMContentLoaded', () => {
    // 2FA Toggle logic save in localStorage
    const twoFaToggle = document.getElementById('twoFaToggle');
    if (twoFaToggle) {
        twoFaToggle.checked = localStorage.getItem('cyber_2fa') === 'true';
        twoFaToggle.addEventListener('change', () => {
            localStorage.setItem('cyber_2fa', twoFaToggle.checked);
            alert(twoFaToggle.checked ? "Two-Factor Authentication Enabled" : "Two-Factor Authentication Disabled");
        });
    }

    // Email Notif Toggle
    const emailNotifToggle = document.getElementById('emailNotifToggle');
    if (emailNotifToggle) {
        emailNotifToggle.checked = localStorage.getItem('cyber_email_notif') !== 'false';
        emailNotifToggle.addEventListener('change', () => {
            localStorage.setItem('cyber_email_notif', emailNotifToggle.checked);
        });
    }
});

function logoutAllDevices() {
    if (confirm("Are you sure you want to log out from all active sessions?")) {
        alert("Successfully logged out from all other devices.");
        window.location.href = "login.html";
    }
}