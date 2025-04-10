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

// Simulate loading process with a timer
let progress = 0;
const progressBar = document.getElementById('progress-bar');
const percentText = document.getElementById('percent');

function simulateLoading() {
    const interval = setInterval(() => {
        progress += 1;  // Increment the progress
        const progressAngle = (progress / 100) * 360;  // Calculate the angle based on percentage

        // Update the circle border to reflect progress
        progressBar.style.transform = `rotate(${progressAngle}deg)`;
        percentText.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);  // Stop the interval once it's 100%
            // After loading is complete, hide the loading screen and show the main content
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }
    }, 50);  // Speed of loading (50ms per increment)
}

// Start the loading simulation once the page loads
window.onload = simulateLoading;

const form = document.querySelector('.contact form');
if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the page from refreshing
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const message = form.querySelector('textarea').value;
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);
    });
}

// Existing code (hamburger and loading simulation) remains unchanged...
const thankYouDiv = document.getElementById('thank-you-message');

if (form && thankYouDiv) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop the default form submission (no redirect)

        // Get form data
        const formData = new FormData(form);

        try {
            // Send the form data to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show custom thank-you message
                thankYouDiv.style.display = 'block';
                thankYouDiv.textContent = 'Thank you for your message! I’ll get back to you soon.';
                thankYouDiv.style.color = 'white'; // Match your site’s style
                form.reset(); // Clear the form fields
            } else {
                thankYouDiv.style.display = 'block';
                thankYouDiv.textContent = 'Oops! Something went wrong. Please try again.';
                thankYouDiv.style.color = '#ff5555'; // Red for error
            }
        } catch (error) {
            thankYouDiv.style.display = 'block';
            thankYouDiv.textContent = 'Error submitting form. Check your connection and try again.';
            thankYouDiv.style.color = '#ff5555';
        }
    });
}

// Existing code (hamburger, loading, contact form) remains unchanged...

// Chat system
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const chatStatus = document.getElementById('chat-status');

if (chatForm && chatMessages && chatStatus) {
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent page reload

        const message = document.getElementById('chat-input').value;

        // Display the message on the page
        const messageDiv = document.createElement('p');
        messageDiv.textContent = `You: ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom

        // Send to Formspree
        const formData = new FormData();
        formData.append('message', message);
        formData.append('_subject', 'New Chat Message'); // Custom email subject

        try {
            const response = await fetch('https://formspree.io/f/moveylzy', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                chatStatus.style.display = 'block';
                chatStatus.textContent = 'Message sent! I’ll reply soon.';
                setTimeout(() => {
                    chatStatus.style.display = 'none';
                }, 3000); // Hide status after 3 seconds
            } else {
                chatStatus.style.display = 'block';
                chatStatus.textContent = 'Oops! Failed to send. Try again.';
                chatStatus.style.color = '#ff5555';
            }
        } catch (error) {
            chatStatus.style.display = 'block';
            chatStatus.textContent = 'Error! Check your connection.';
            chatStatus.style.color = '#ff5555';
        }

        // Clear input
        chatForm.reset();
    });
}