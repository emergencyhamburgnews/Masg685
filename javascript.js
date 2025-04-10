// Check if hamburger exists and log when clicked
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        console.log('Hamburger clicked! Menu is now:', navLinks.classList.contains('active') ? 'open' : 'closed');
    });
} else {
    console.error('Hamburger or nav-links not found!');
}

