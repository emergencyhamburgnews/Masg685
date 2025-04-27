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
    });
}

// JavaScript for Nexus contact form (contactn.html)
document.addEventListener('DOMContentLoaded', function() {
    try {
        const contactNForm = document.getElementById('contactn-form');
        const thankYouMsg = document.getElementById('thank-you-message');

        if (contactNForm) {
            contactNForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                const formData = new FormData(contactNForm);

                try {
                    const response = await fetch('https://formspree.io/f/xjikwkaar', {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        if (thankYouMsg) {
                            thankYouMsg.style.display = 'block';
                            thankYouMsg.textContent = 'Message sent! Nexus will reply soon.';
                        }
                        contactNForm.reset();
                    } else {
                        if (thankYouMsg) {
                            thankYouMsg.style.display = 'block';
                            thankYouMsg.textContent = 'Oops! Failed to send. Try again.';
                        }
                    }
                } catch (error) {
                    if (thankYouMsg) {
                        thankYouMsg.style.display = 'block';
                        thankYouMsg.textContent = 'Error! Check your connection.';
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error initializing Nexus contact form:', e);
    }
});
