// Theme toggle functionality
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// Check if hamburger exists and log when clicked
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        console.log('Hamburger clicked! Menu is now:', navLinks.classList.contains('active') ? 'open' : 'closed');
    });
} else {
    console.error('Hamburger or nav-links not found!');
}

// Scroll to top functionality
const scrollTopButton = document.querySelector('.scroll-top');
if (scrollTopButton) {
    const toggleScrollButton = () => {
        if (window.scrollY > 100) {
            scrollTopButton.classList.add('show');
        } else {
            scrollTopButton.classList.remove('show');
        }
    };

    // Check on scroll
    window.addEventListener('scroll', toggleScrollButton);
    // Check on page load
    window.addEventListener('DOMContentLoaded', toggleScrollButton);
    // Check after content loads
    window.addEventListener('load', toggleScrollButton);

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
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
// Search functionality
const searchIcon = document.querySelector('.search-icon');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results');
const searchClose = document.querySelector('.search-close');

function openSearch() {
    searchContainer.style.display = 'flex';
    searchInput.focus();
}

function closeSearch() {
    searchContainer.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '';
}

function performSearch(query) {
    const searchQuery = query.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!searchQuery) return;

    const content = document.body.innerText.toLowerCase();
    const matches = content.includes(searchQuery);

    if (!matches) {
        searchResults.innerHTML = `
            <div class="no-results">
                Hmmmm.... looks like there weren't any results for "${query}"
            </div>
        `;
        return;
    }

    // Find all elements containing the search query
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, li');
    let foundResults = false;

    elements.forEach(element => {
        if (element.innerText.toLowerCase().includes(searchQuery)) {
            foundResults = true;
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = element.innerText.trim();
            resultItem.addEventListener('click', () => {
                element.scrollIntoView({ behavior: 'smooth' });
                element.style.backgroundColor = '#ffeb3b50';
                setTimeout(() => {
                    element.style.backgroundColor = '';
                }, 2000);
                closeSearch();
            });
            searchResults.appendChild(resultItem);
        }
    });

    if (!foundResults) {
        searchResults.innerHTML = `
            <div class="no-results">
                Hmmmm.... looks like there weren't any results for "${query}"
            </div>
        `;
    }
}

function findMatches(content, query) {
    const matches = [];
    const regex = new RegExp(`[^.]*${query}[^.]*\\.?`, 'gi');
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[0].trim());
    }
    return matches;
}

function addSearchResult(url, text) {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.textContent = text;
    div.onclick = () => {
        window.location.href = `${url}#${encodeURIComponent(text)}`;
        closeSearch();
    };
    searchResults.appendChild(div);
}

if (searchIcon) {
    searchIcon.addEventListener('click', openSearch);
}

if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
}

// Close search when clicking outside
if (searchContainer) {
    searchContainer.addEventListener('click', (e) => {
        if (e.target === searchContainer) {
            closeSearch();
        }
    });
}

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