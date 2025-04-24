// Theme toggle functionality
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Roblox profile integration
async function updateRobloxProfile() {
    const profile = {
        userId: '5255024681',
        username: 'masg685'
    };

    const avatarElement = document.getElementById('roblox-avatar');
    const usernameElement = document.getElementById('roblox-username');

    if (!avatarElement || !usernameElement) {
        console.error('Profile elements not found:', {
            avatar: !!avatarElement,
            username: !!usernameElement
        });
        return;
    }

    // Set loading state
    avatarElement.style.opacity = '0.5';
    usernameElement.textContent = 'Loading...';

    const retryFetch = async (url, attempts = 3) => {
        for (let i = 0; i < attempts; i++) {
            try {
                console.log(`Attempting to fetch from ${url}`);
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    mode: 'cors',
                    credentials: 'omit'
                });
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            } catch (err) {
                console.error(`Attempt ${i + 1} failed:`, err);
                if (i === attempts - 1) throw err;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        throw new Error('Max retry attempts reached');
    };

    try {
        // Fetch user data first
        console.log('Fetching user data...');
        const userResponse = await retryFetch(`https://users.roblox.com/v1/users/${profile.userId}`);
        const userData = await userResponse.json();
        console.log('User data received:', userData);

        // Update username immediately
        usernameElement.textContent = userData.displayName || userData.name || profile.username;

        // Then fetch avatar
        console.log('Fetching avatar data...');
        const avatarResponse = await retryFetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${profile.userId}&size=150x150&format=Png`);
        const avatarData = await avatarResponse.json();
        console.log('Avatar data received:', avatarData);

        if (avatarData.data && avatarData.data[0] && avatarData.data[0].imageUrl) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                avatarElement.src = img.src;
                avatarElement.style.opacity = '1';
                console.log('Avatar image loaded successfully');
            };
            img.onerror = (e) => {
                console.error('Failed to load avatar image:', e);
                avatarElement.src = 'https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png';
                avatarElement.style.opacity = '1';
            };
            img.src = avatarData.data[0].imageUrl;
        } else {
            console.error('No avatar data received:', avatarData);
            throw new Error('No avatar data received');
        }

    } catch (error) {
        console.error('Error fetching Roblox profile:', error);
        usernameElement.textContent = profile.username;
        avatarElement.src = 'https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png';
        avatarElement.style.opacity = '1';
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // Initialize Roblox profile if on the right page
    if (document.getElementById('roblox-profile')) {
        updateRobloxProfile();
    }

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Search functionality
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    
    function openSearch() {
        if (searchContainer) {
            searchContainer.style.display = 'flex';
            searchInput.focus();
        }
    }

    // Add click handler for search toggle button
    document.querySelector('.search-toggle')?.addEventListener('click', openSearch);

    function removeHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        });
    }

    function performSearch(query) {
        const searchText = query.toLowerCase();
        const contentElements = document.querySelectorAll('main p, main h1, main h2, main h3, main li, main span, .about p, .contact p, .updates-container p, .private-server p, .form-container p, .chat p');
        
        removeHighlights();
        
        let firstMatch = null;
        let firstMatchText = '';

        contentElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchText)) {
                const regex = new RegExp(`(${searchText})`, 'gi');
                element.innerHTML = element.textContent.replace(regex, '<span class="search-highlight">$1</span>');
                
                // Store the first match
                if (!firstMatch) {
                    firstMatch = element;
                    firstMatchText = text;
                }
            }
        });

        if (firstMatch) {
            // Close search container
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.style.display = 'none';
            }

            // Clear search input
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = '';
            }

            // Scroll to the match with offset for better visibility
            const offset = 100; // Pixels from the top
            const elementPosition = firstMatch.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
            });

            // Highlight will remain visible
            setTimeout(() => {
                const highlight = firstMatch.querySelector('.search-highlight');
                if (highlight) {
                    highlight.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                }
            }, 100);
        }
    }

    // Add search input handler
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });

        // Also handle input changes for real-time search
        searchInput.addEventListener('input', function(e) {
            const query = this.value.trim();
            if (query) {
                performSearch(query);
            } else {
                removeHighlights();
            }
        });
    }

    // Add close button handler
    const closeSearchBtn = document.querySelector('.close-search');
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', () => {
            if (searchContainer) {
                searchContainer.style.display = 'none';
                removeHighlights();
            }
        });
    }

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (searchContainer && 
            !searchContainer.contains(e.target) && 
            !e.target.classList.contains('search-toggle') &&
            !e.target.classList.contains('fa-search')) {
            searchContainer.style.display = 'none';
            removeHighlights();
        }
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer) {
            searchContainer.style.display = 'none';
            removeHighlights();
        }
    });

    // Scroll to top functionality
    const scrollTopButton = document.querySelector('.scroll-top');
    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopButton.style.display = 'flex';
            } else {
                scrollTopButton.style.display = 'none';
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Rules Modal functionality
    function initializeRulesModal() {
        const rulesModal = document.getElementById('rules-modal');
        const rulesButtons = document.querySelectorAll('.rules-button');
        const closeButton = document.querySelector('.close-button');

        if (rulesButtons && rulesModal) {
            rulesButtons.forEach(button => {
                button.addEventListener('click', () => {
                    rulesModal.style.display = 'block';
                });
            });
        }

        if (closeButton && rulesModal) {
            closeButton.addEventListener('click', () => {
                rulesModal.style.display = 'none';
            });

            // Close modal when clicking outside
            window.addEventListener('click', (event) => {
                if (event.target === rulesModal) {
                    rulesModal.style.display = 'none';
                }
            });
        }
    }

    // Initialize modal functionality
    initializeRulesModal();

    // Handle report form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = reportForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                const response = await fetch(reportForm.action, {
                    method: 'POST',
                    body: new FormData(reportForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitButton.textContent = 'Sent Successfully!';
                    reportForm.reset();
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                    }, 3000);
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                submitButton.textContent = 'Failed to Send';
                setTimeout(() => {
                    submitButton.textContent = originalText;
                }, 3000);
            }
            submitButton.disabled = false;
        });
    }

    // Handle unban request form submission
    const unbanForm = document.getElementById('unbanForm');
    if (unbanForm) {
        unbanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = unbanForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                const response = await fetch(unbanForm.action, {
                    method: 'POST',
                    body: new FormData(unbanForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitButton.textContent = 'Sent Successfully!';
                    submitButton.style.background = '#4CAF50';
                    unbanForm.reset();
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.style.background = '';
                    }, 3000);
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                submitButton.textContent = 'Failed to Send';
                submitButton.style.background = '#f44336';
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                }, 3000);
            }
            submitButton.disabled = false;
        });
    }

    // Private Server Join Button
    const joinButton = document.getElementById('join-server');
    if (joinButton) {
        joinButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'https://www.roblox.com/games/7711635737';
        });
    }

    // Update player count from Roblox server
    const currentPlayers = document.getElementById('current-players');
    if (currentPlayers) {
        async function updatePlayerCount() {
            try {
                // Fetch player count for Emergency Hamburg
                const response = await fetch(`https://games.roblox.com/v1/games/7711635737/servers/Public?sortOrder=Asc&limit=100`);
                const data = await response.json();

                let totalPlayers = 0;
                if (data.data && data.data.length > 0) {
                    // Sum up players from all servers
                    totalPlayers = data.data.reduce((sum, server) => sum + server.playing, 0);
                }

                currentPlayers.textContent = totalPlayers;
            } catch (error) {
                console.error('Error fetching player count:', error);
                currentPlayers.textContent = '0';
            }
        }

        // Update initially and then every 30 seconds
        updatePlayerCount();
        setInterval(updatePlayerCount, 30000);
    }

    // Create Post Button Click Handler
    const createPostBtn = document.getElementById('create-post-btn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', () => {
            // Check if already logged in
            const sessionExpiry = localStorage.getItem('adminSession');
            if (sessionExpiry) {
                const expiryDate = new Date(sessionExpiry);
                if (expiryDate > new Date()) {
                    // Already logged in, show post form directly
                    document.getElementById('post-form').style.display = 'block';
                    document.getElementById('login').style.display = 'none';
                    return;
                }
                localStorage.removeItem('adminSession');
            }
            // Show login form
            document.getElementById('login').style.display = 'block';
            document.getElementById('post-form').style.display = 'none';
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        });
    }

    // Check and clean up expired username on page load
    const userNameExpiry = localStorage.getItem('userNameExpiry');
    if (userNameExpiry) {
        const expiryDate = new Date(userNameExpiry);
        if (expiryDate < new Date()) {
            // Remove expired username from the list
            const existingUsers = JSON.parse(localStorage.getItem('existingUsernames') || '[]');
            const userName = localStorage.getItem('userName');
            if (userName) {
                const index = existingUsers.indexOf(userName);
                if (index > -1) {
                    existingUsers.splice(index, 1);
                    localStorage.setItem('existingUsernames', JSON.stringify(existingUsers));
                }
            }
            // Clear expired user data
            localStorage.removeItem('userName');
            localStorage.removeItem('userNameExpiry');
        }
    }
});

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
                chatStatus.textContent = 'Message sent! I\'ll reply soon.';
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

// Post functionality
const ADMIN_PASSWORD = 'Masg68525!'; // Using the same password as before
let posts = JSON.parse(localStorage.getItem('posts') || '[]');

// Login functionality
function login() {
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('post-form').style.display = 'block';
        document.getElementById('password').value = '';
        
        // Set session expiry to 50 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 50);
        localStorage.setItem('adminSession', expiryDate.toISOString());
    } else {
        alert('Incorrect password');
    }
}

// Handle image preview
document.getElementById('image-post')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        const preview = document.getElementById('image-preview');
        
        reader.onload = function(e) {
            preview.style.display = 'block';
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        
        reader.readAsDataURL(file);
    }
});

// Submit post
async function submitPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('text-post').value;
    const imageInput = document.getElementById('image-post');
    const file = imageInput?.files[0];

    if (!title || !content) {
        alert('Please fill in both title and content');
        return;
    }

    let imageData = null;
    if (file) {
        imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Convert relative URLs to absolute URLs
                const baseUrl = window.location.origin;
                const imageUrl = e.target.result;
                resolve(imageUrl.startsWith('data:') ? imageUrl : `${baseUrl}/${imageUrl}`);
            };
            reader.readAsDataURL(file);
        });
    }

    // Create new post
    const newPost = {
        id: Date.now(),
        title,
        content,
        image: imageData,
        date: new Date().toISOString(),
        likes: 0,
        comments: []
    };

    // Replace all posts with just the new one
    posts = [newPost];
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Clear form
    document.getElementById('post-title').value = '';
    document.getElementById('text-post').value = '';
    document.getElementById('image-post').value = '';
    document.getElementById('image-preview').style.display = 'none';
    
    // Refresh posts display
    displayPosts();
}

// Display posts
function displayPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;

    container.innerHTML = posts.length ? '' : '<div class="loading-posts">No posts yet</div>';

    const baseUrl = window.location.origin;

    posts.forEach(post => {
        const date = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Ensure image URL is absolute
        const imageUrl = post.image ? (post.image.startsWith('data:') || post.image.startsWith('http') ? post.image : `${baseUrl}/${post.image}`) : '';

        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-header">
                <h2 class="post-title">${post.title}</h2>
                <div class="post-date">${date}</div>
            </div>
            <div class="post-content">
                <div class="post-text">${post.content}</div>
                ${imageUrl ? `
                    <a href="${imageUrl}" target="_blank" class="post-image-link">
                        <img src="${imageUrl}" alt="${post.title}" class="post-image">
                    </a>
                ` : ''}
            </div>
            <div class="post-footer">
                <div class="post-actions">
                    <button class="action-button like-button ${post.likedBy?.includes(getUserId()) ? 'active' : ''}" onclick="toggleLike(${post.id})">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes || 0}</span>
                    </button>
                    <button class="action-button comment-button" onclick="toggleComments(${post.id})">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments?.length || 0}</span>
                    </button>
                </div>
            </div>
            <div class="comment-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-container">
                    ${!localStorage.getItem('userName') ? `
                        <div class="name-input-section">
                            <input type="text" class="name-input" placeholder="Enter your name to comment...">
                            <button class="post-button save-name-btn" onclick="saveName(${post.id})">Save Name</button>
                        </div>
                    ` : `
                        <div class="comment-input-section">
                            <input type="text" class="comment-input" placeholder="Write a comment...">
                            <button class="post-button post-comment-btn" onclick="addComment(${post.id})">Post Comment</button>
                        </div>
                    `}
                    <div class="comments-list">
                        ${(post.comments || []).map(comment => `
                            <div class="comment-item">
                                <span class="comment-author ${comment.userName === 'Masg685' ? 'owner-name' : ''}">
                                    ${comment.userName === 'Masg685' ? '<i class="fas fa-crown owner-crown"></i> ' : ''}${comment.userName}:
                                </span>
                                <span class="comment-text">${comment.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(postElement);
    });
}

// Get unique ID for user (for like tracking)
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

// Toggle like status
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const userId = getUserId();
    post.likedBy = post.likedBy || [];
    
    const userLikeIndex = post.likedBy.indexOf(userId);
    if (userLikeIndex === -1) {
        // User hasn't liked the post yet - add like
        post.likedBy.push(userId);
        post.likes = (post.likes || 0) + 1;
    } else {
        // User already liked the post - remove like
        post.likedBy.splice(userLikeIndex, 1);
        post.likes = Math.max(0, (post.likes || 1) - 1);
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

// Toggle comments visibility
function toggleComments(postId) {
    const commentSection = document.getElementById(`comments-${postId}`);
    if (commentSection) {
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Save user name
function saveName(postId) {
    const nameInput = document.querySelector(`#comments-${postId} .name-input`);
    const name = nameInput?.value.trim();
    
    // Check if name is empty
    if (!name) {
        alert('Please enter a valid name');
        return;
    }

    // Check if trying to use owner's name
    if (name.toLowerCase() === 'masg685') {
        alert('This username is reserved. Please choose a different name.');
        nameInput.value = '';
        return;
    }

    // Get all existing usernames from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('existingUsernames') || '[]');
    
    // Check if name is already taken
    if (existingUsers.includes(name)) {
        alert('This name is already taken. Please choose a different name.');
        nameInput.value = '';
        return;
    }

    // Save the new username to the list
    existingUsers.push(name);
    localStorage.setItem('existingUsernames', JSON.stringify(existingUsers));

    // Save username with expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 50);
    localStorage.setItem('userName', name);
    localStorage.setItem('userNameExpiry', expiryDate.toISOString());
    
    // Refresh the display to show comment input
    displayPosts();
}

// Add comment to post
function addComment(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const commentInput = document.querySelector(`#comments-${postId} .comment-input`);
    const commentText = commentInput?.value.trim();
    const userName = localStorage.getItem('userName');

    if (commentText && userName) {
        // Add new comment
        post.comments = post.comments || [];
        post.comments.unshift({
            id: Date.now(),
            userName: userName,
            text: commentText
        });

        // Save to localStorage and refresh display
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
        
        // Keep the comment section open and clear input
        const commentSection = document.getElementById(`comments-${postId}`);
        if (commentSection) {
            commentSection.style.display = 'block';
            commentInput.value = '';
        }
    }
}

// Initialize posts display
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
});

// Navigation function
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'home.html';
    }
}