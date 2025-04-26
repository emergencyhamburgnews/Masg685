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

    if (!avatarElement || !usernameElement) return;

    avatarElement.style.opacity = '0.5';
    usernameElement.textContent = profile.username;

    const avatarUrl = `https://www.roblox.com/headshot-thumbnail/image?userId=${profile.userId}&width=150&height=150&format=png`;
    avatarElement.src = avatarUrl;
    avatarElement.onload = () => avatarElement.style.opacity = '1';
    avatarElement.onerror = () => {
        // Use the specific avatar URL as fallback
        avatarElement.src = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-5929DDFE20EB1B4D7B3C06D885B0627E-Png/150/150/AvatarHeadshot/Webp/noFilter';
        avatarElement.style.opacity = '1';
    };

    try {
        const response = await fetch(`https://users.roblox.com/v1/users/${profile.userId}`);
        if (response.ok) {
            const data = await response.json();
            usernameElement.textContent = data.displayName || data.name || profile.username;
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
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

    // Discord button click handler
    const discordButton = document.querySelector('a[href*="discord.gg"]');
    if (discordButton) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            display: none;
            padding: 15px;
            margin: 10px 0;
            border: 2px solid #ff0000;
            border-radius: 5px;
            color: #ff0000;
            background-color: rgba(255, 0, 0, 0.1);
            text-align: center;
            font-weight: bold;
            animation: fadeIn 0.3s ease-in-out;
        `;
        messageElement.textContent = 'Sorry, the Discord server is currently under development. Please check back later!';
        
        // Insert message after the button
        discordButton.parentNode.insertBefore(messageElement, discordButton.nextSibling);

        discordButton.addEventListener('click', (e) => {
            e.preventDefault();
            messageElement.style.display = 'block';
            
            // Hide message after 3 seconds
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        });
    }

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileNavLinks = document.querySelector('.nav-links');
    
    if (hamburger && mobileNavLinks) {
        hamburger.style.display = 'none'; // Reset display property
        
        // Show hamburger on mobile
        const checkMobileView = () => {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'block';
                if (!mobileNavLinks.classList.contains('active')) {
                    mobileNavLinks.classList.remove('active');
                }
            } else {
                hamburger.style.display = 'none';
                hamburger.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            }
        };

        // Check on load and resize
        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileNavLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            }
        });

        // Prevent menu from closing when clicking inside nav links
        mobileNavLinks.addEventListener('click', (e) => {
            e.stopPropagation();
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
    const searchResults = document.querySelector('.search-results');
    
    // Add click handler for search toggle button
    document.querySelector('.search-toggle')?.addEventListener('click', openSearch);

    // Common questions and their answers
    const commonQuestions = [
        {
            question: "How to join private server?",
            keywords: ["private server", "join server", "server join"]
        },
        {
            question: "Where to download sounds?",
            keywords: ["hit sounds", "sound effects", "download sounds", "audio"]
        },
        {
            question: "How to contact?",
            keywords: ["contact", "reach out", "message", "email"]
        },
        {
            question: "What's new in updates?",
            keywords: ["updates", "changes", "new features", "latest"]
        },
        {
            question: "How to report a player?",
            keywords: ["report player", "report", "complaint"]
        },
        {
            question: "How to request unban?",
            keywords: ["unban", "ban appeal", "banned"]
        },
        {
            question: "How to use TikTok downloader?",
            keywords: ["tiktok", "download video", "tiktok download"]
        },
        {
            question: "Where is the Roblox profile?",
            keywords: ["roblox", "profile", "account"]
        },
        {
            question: "How to change theme?",
            keywords: ["theme", "dark mode", "light mode", "color"]
        },
        {
            question: "Where to find social media links?",
            keywords: ["social media", "links", "youtube", "twitter", "tiktok"]
        },
        {
            question: "How to use chat feature?",
            keywords: ["chat", "message", "68I"]
        },
        {
            question: "Server status and player count?",
            keywords: ["status", "players", "online", "count"]
        }
    ];

    function openSearch() {
        if (searchContainer) {
            searchContainer.style.display = 'flex';
            searchInput.focus();
            showSearchSuggestions();
        }
    }

    function showSearchSuggestions() {
        if (!searchResults) return;
        
        // Create suggestions container if it doesn't exist
        let suggestionsContainer = searchResults.querySelector('.search-suggestions');
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            searchResults.appendChild(suggestionsContainer);
        }

        // Add suggestion buttons with all keywords for better matching
        suggestionsContainer.innerHTML = commonQuestions
            .map(item => `
                <button class="search-suggestion" 
                    onclick="performSearch('${item.question}')"
                    data-keywords="${item.keywords.join(' ')}">
                    ${item.question}
                </button>
            `).join('');
    }

    function removeHighlights() {
        const highlights = document.querySelectorAll('.search-highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        });
    }

    function performSearch(query) {
        const searchText = query.toLowerCase();
        // Only search in main content areas, excluding navigation and layout elements
        const contentElements = document.querySelectorAll(
            'main p, main h1, main h2, main h3, main li, main span, ' + 
            '.hero p, .hero h1, ' +
            '.about p, .about h1, .about h2, .about h3, ' +
            '.contact p, .contact h1, .contact h2, ' +
            '.updates-container p, .updates-container h1, .updates-container h2, ' +
            '.private-server p, .private-server h1, .private-server h2, ' +
            '.form-container p, .form-container h1, .form-container h2, ' +
            '.chat p, .chat h1, .chat h2, ' +
            '.sound-effects h2, .sound-effects h3, ' +
            '.social-media h1, .social-media p'
        );
        
        removeHighlights();
        
        let matches = [];
        let firstMatch = null;
        let bestMatchScore = 0;

        // Find the question if it matches one of our common questions
        const matchedQuestion = commonQuestions.find(q => 
            q.question.toLowerCase() === searchText || 
            q.keywords.some(k => searchText.includes(k.toLowerCase()))
        );

        contentElements.forEach(element => {
            // Skip if element is part of navigation or layout
            if (element.closest('.nav-links') || 
                element.closest('.navbar') || 
                element.closest('.hamburger') ||
                element.closest('footer')) {
                return;
            }

            const text = element.textContent.toLowerCase();
            const keywords = matchedQuestion ? matchedQuestion.keywords : [searchText];
            
            // Check if element contains any of the keywords
            const matchesKeyword = keywords.some(keyword => text.includes(keyword.toLowerCase()));
            
            if (matchesKeyword) {
                const score = calculateRelevanceScore(text, searchText, element);
                
                // Highlight the matching text
                keywords.forEach(keyword => {
                    const regex = new RegExp(`(${keyword})`, 'gi');
                    element.innerHTML = element.textContent.replace(regex, '<span class="search-highlight">$1</span>');
                });
                
                matches.push({
                    element: element,
                    text: text,
                    score: score
                });

                if (score > bestMatchScore) {
                    firstMatch = element;
                    bestMatchScore = score;
                }
            }
        });

        // Sort matches by relevance score
        matches.sort((a, b) => b.score - a.score);

        // Update search results
        if (searchResults && matches.length > 0) {
            searchResults.innerHTML = `
                <div class="search-suggestions"></div>
                ${matches.map(match => `
                    <div class="search-result-item" onclick="scrollToElement('${match.element.id || generateElementId(match.element)}')">
                        <div class="search-result-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <div class="search-result-content">
                            <h3>${getContextTitle(match.element)}</h3>
                            <p>${getHighlightedSnippet(match.text, searchText)}</p>
                        </div>
                    </div>
                `).join('')}
            `;

            // Re-add suggestions
            showSearchSuggestions();
        }

        if (firstMatch) {
            // Close search container
            searchContainer.style.display = 'none';
            
            // Clear search input
            searchInput.value = '';

            // Scroll to the match with smooth animation
            scrollToElement(firstMatch.id || generateElementId(firstMatch));
        }
    }

    function calculateRelevanceScore(text, searchText, element) {
        let score = 0;
        
        // Check element type and location
        if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') score += 15;
        if (element.closest('section')?.querySelector('h1, h2, h3')?.textContent.toLowerCase().includes(searchText)) score += 10;
        if (element.tagName === 'A' || element.tagName === 'BUTTON') score += 5;
        
        // Check content relevance
        if (text.includes(searchText)) score += 10;
        if (text.length < 100) score += 5;
        score += (text.match(new RegExp(searchText, 'gi')) || []).length;
        
        // Check if element is in view
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) score += 3;
        
        return score;
    }

    function getContextTitle(element) {
        // Get nearest heading or first few words
        const nearestHeading = element.closest('section')?.querySelector('h1, h2, h3')?.textContent;
        return nearestHeading || element.textContent.slice(0, 50) + '...';
    }

    function getHighlightedSnippet(text, searchText) {
        const index = text.toLowerCase().indexOf(searchText.toLowerCase());
        const start = Math.max(0, index - 30);
        const end = Math.min(text.length, index + searchText.length + 30);
        let snippet = text.slice(start, end);
        
        // Add ellipsis if needed
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet += '...';
        
        // Highlight search term
        return snippet.replace(new RegExp(searchText, 'gi'), match => `<span class="search-highlight">${match}</span>`);
    }

    function generateElementId(element) {
        if (!element.id) {
            element.id = 'search-result-' + Math.random().toString(36).substr(2, 9);
        }
        return element.id;
    }

    function scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Scroll to element with offset for better visibility
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });

        // Add focus animation to the element
        element.style.transition = 'all 0.3s ease';
        element.style.transform = 'scale(1.02)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }

    // Add search input handlers
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    // Find first matching element that's not in layout
                    const elements = document.querySelectorAll('*');
                    let bestMatch = null;
                    let bestScore = 0;

                    elements.forEach(element => {
                        // Skip if element is part of navigation or layout
                        if (element.closest('.nav-links') || 
                            element.closest('.navbar') || 
                            element.closest('.hamburger') ||
                            element.closest('footer') ||
                            element.closest('.theme-container') ||
                            element.closest('.search-container')) {
                            return;
                        }

                        const text = element.textContent.toLowerCase();
                        if (text.includes(query.toLowerCase())) {
                            const score = calculateRelevanceScore(text, query, element);
                            if (score > bestScore) {
                                bestScore = score;
                                bestMatch = element;
                            }
                        }
                    });

                    if (bestMatch) {
                        // Close search container
                        searchContainer.style.display = 'none';
                        
                        // Clear search input
                        this.value = '';

                        // Scroll to the match
                        scrollToElement(bestMatch.id || generateElementId(bestMatch));
                    }
                }
            }
        });

        // Real-time search as user types
        searchInput.addEventListener('input', function(e) {
            const query = this.value.trim();
            if (query.length >= 2) { // Only search if 2 or more characters
                performSearch(query);
            } else {
                removeHighlights();
                showSearchSuggestions();
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
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            display: none;
            padding: 15px;
            margin: 10px 0;
            border: 2px solid #ff0000;
            border-radius: 5px;
            color: #ff0000;
            background-color: rgba(255, 0, 0, 0.1);
            text-align: center;
            font-weight: bold;
        `;
        messageDiv.textContent = 'Sorry, the Private Server is not available yet. Please check back later!';
        joinButton.parentNode.insertBefore(messageDiv, joinButton.nextSibling);

        joinButton.addEventListener('click', (e) => {
            e.preventDefault();
            messageDiv.style.display = 'block';
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
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

    // Initialize sounds for mobile
    initializeSounds();
    
    // Add touch event listeners for mobile
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent double-firing on mobile
            const soundId = button.getAttribute('data-sound');
            if (soundId) {
                playSound(soundId);
            }
        });
    });
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
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    // Add new post while keeping existing ones
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
        id: Date.now(),
        title: 'Website Updates - Bug Fixes (October 2023)',
        content: `🔄 Recent Bug Fixes and Improvements:

🛠️ Fixed Issues:
- Fixed mobile menu text and icons color in light mode
- Fixed sound effects not playing on mobile devices
- Fixed download functionality for mobile users
- Improved mobile compatibility for audio playback
- Enhanced touch event handling for iOS devices

✨ Previous Updates Still Active:
- Multi-language support (English, Vietnamese, Samoan)
- Language selector in navigation
- Improved Help Center with predefined questions
- Enhanced search functionality
- Better mobile responsiveness

💡 Previous Features Still Available:
- TikTok Downloader
- Private Server information
- Contact form
- Server status
- User reporting system
- Unban request system

These fixes improve the mobile experience and ensure better functionality across all devices.`,
        image: null,
        date: new Date().toISOString(),
        likes: 0,
        comments: []
    };

    // Add new post to the beginning of the array
    existingPosts.unshift(newPost);
    
    // Save all posts
    localStorage.setItem('posts', JSON.stringify(existingPosts));
    
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

// Sound effects functionality
const sounds = {
    hit1: new Audio('sounds/1 hit .mp3'),
    hit2: new Audio('sounds/2 hits .mp3'),
    hit3: new Audio('sounds/3 hits.mp3'),
    hit4: new Audio('sounds/4 hits.mp3')
};

// Initialize sounds for mobile
function initializeSounds() {
    Object.values(sounds).forEach(sound => {
        sound.preload = 'auto';
        // Remove initial volume setting to prevent mobile blocking
        sound.playsinline = true;
        sound.muted = false;
        // Add touch event handler for iOS
        sound.load();
    });
}

// Initialize sounds on page load
document.addEventListener('DOMContentLoaded', initializeSounds);

function playSound(soundId) {
    const sound = sounds[soundId];
    if (!sound) return;
    
    // Stop other sounds
    Object.values(sounds).forEach(s => {
        s.pause();
        s.currentTime = 0;
    });
    
    // Create user interaction promise
    const playPromise = sound.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            sound.volume = 1.0;
        }).catch(error => {
            console.log("Playback failed:", error);
            // Try to initialize and play again
            sound.load();
            sound.play().catch(e => console.log("Retry failed:", e));
        });
    }
}

function downloadSound(soundId) {
    const soundFiles = {
        hit1: '1 hit .mp3',
        hit2: '2 hits .mp3',
        hit3: '3 hits.mp3',
        hit4: '4 hits.mp3'
    };

    const fileName = soundFiles[soundId];
    const soundPath = 'sounds/' + fileName;

    // For mobile devices, open in new tab
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.open(soundPath, '_blank');
        return;
    }
    
    // For desktop, use XHR download
    const xhr = new XMLHttpRequest();
    xhr.open('GET', soundPath, true);
    xhr.responseType = 'blob';
    
    xhr.onload = function() {
        if (this.status === 200) {
            const blob = new Blob([this.response], { type: 'audio/mpeg' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        }
    };
    
    xhr.send();
}