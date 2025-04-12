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

function login() {
    const pw = document.getElementById('password').value;
    if (pw === "Masg68525!") {
        document.getElementById('post-form').style.display = 'block';
        document.getElementById('login').style.display = 'none';
        // Set session expiry to 50 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 50);
        localStorage.setItem('adminSession', expiryDate.toISOString());
        // Clear password field
        document.getElementById('password').value = '';
    } else {
        alert("Wrong password!");
    }
}

// Check admin session on page load
window.addEventListener('DOMContentLoaded', () => {
    const sessionExpiry = localStorage.getItem('adminSession');
    if (sessionExpiry) {
        const expiryDate = new Date(sessionExpiry);
        if (expiryDate > new Date()) {
            document.getElementById('post-form').style.display = 'block';
            document.getElementById('login').style.display = 'none';
        } else {
            localStorage.removeItem('adminSession');
        }
    }
});

  function submitPost() {
    const title = document.getElementById('post-title').value;
    const text = document.getElementById('text-post').value;
    const imageInput = document.getElementById('image-post');
    const postArea = document.getElementById('post-area');
    const allPosts = document.getElementById('all-posts'); // Assuming this element exists

    // Store post data
    const postData = {
        title: title,
        text: text,
        timestamp: new Date().toISOString()
    };

    // Clear old post
    postArea.innerHTML = "";

    const contentDiv = document.createElement('div');

    // Add title if present
    if (title.trim() !== "") {
      const h2 = document.createElement('h2');
      h2.textContent = title;
      h2.style.marginBottom = '15px';
      contentDiv.appendChild(h2);
    }

    // If there's text, show it
    if (text.trim() !== "") {
      const p = document.createElement('p');
      p.textContent = text;
      contentDiv.appendChild(p);
    }

    // If there's an image, show it
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        contentDiv.appendChild(img);

        postData.image = e.target.result;
        localStorage.setItem('currentPost', JSON.stringify(postData));

        // Add to public posts
        const publicPost = contentDiv.cloneNode(true);
        allPosts.insertBefore(publicPost, allPosts.firstChild);

        // Add to admin area
        postArea.appendChild(contentDiv);
        addInteractions(postArea);
        addInteractions(publicPost);
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      // If no image, add content and interactions immediately
      localStorage.setItem('currentPost', JSON.stringify(postData));

      // Add to public posts
      const publicPost = contentDiv.cloneNode(true);
      allPosts.insertBefore(publicPost, allPosts.firstChild);

      // Add to admin area
      postArea.appendChild(contentDiv);
      addInteractions(postArea);
      addInteractions(publicPost);
    }
}

// Load saved post on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedPost = localStorage.getItem('currentPost');
    if (savedPost) {
        const postData = JSON.parse(savedPost);
        const postArea = document.getElementById('post-area');
        postArea.innerHTML = '';

        const contentDiv = document.createElement('div');

        if (postData.title) {
            const h2 = document.createElement('h2');
            h2.textContent = postData.title;
            h2.style.marginBottom = '15px';
            contentDiv.appendChild(h2);
        }

        if (postData.text) {
            const p = document.createElement('p');
            p.textContent = postData.text;
            contentDiv.appendChild(p);
        }

        if (postData.image) {
            const img = document.createElement('img');
            img.src = postData.image;
            contentDiv.appendChild(img);
        }

        postArea.appendChild(contentDiv);
        addInteractions(postArea);
    }
});


function addInteractions(postArea) {

    // Add interaction buttons
    const interactions = document.createElement('div');
    interactions.className = 'post-interactions';
    interactions.innerHTML = `
      <button class="interaction-button like-button">
        <i class="fas fa-heart"></i> <span class="like-count">0</span>
      </button>
      <button class="interaction-button comment-button">
        <i class="fas fa-comment"></i> <span class="comment-count">0</span>
      </button>
    `;
    postArea.appendChild(interactions);

    // Add click handlers
    const likeButton = interactions.querySelector('.like-button');
    const likeCount = interactions.querySelector('.like-count');
    const commentButton = interactions.querySelector('.comment-button');
    let liked = false;

    // Create comment section
    const commentSection = document.createElement('div');
    commentSection.className = 'comment-section';
    commentSection.innerHTML = `
      <input type="text" class="comment-input" placeholder="Write a comment...">
      <button class="post-button">Post Comment</button>
      <div class="comments-list"></div>
    `;
    postArea.appendChild(commentSection);

    // Like button functionality
    likeButton.addEventListener('click', () => {
      liked = !liked;
      likeButton.classList.toggle('active');
      likeCount.textContent = liked ? '1' : '0';
    });

    // Comment button functionality
    commentButton.addEventListener('click', () => {
      commentSection.classList.toggle('active');
    });

    // Add comment functionality
    const commentInput = commentSection.querySelector('.comment-input');
    const commentButton2 = commentSection.querySelector('.post-button');
    const commentsList = commentSection.querySelector('.comments-list');
    let commentCount = 0;

    commentButton2.addEventListener('click', () => {
      const commentText = commentInput.value.trim();
      if (commentText) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.textContent = commentText;
        commentsList.appendChild(commentItem);
        commentInput.value = '';
        commentCount++;
        interactions.querySelector('.comment-count').textContent = commentCount;
      }
    });

    // Reset inputs
    document.getElementById('text-post').value = "";
    document.getElementById('image-post').value = "";
}