// Enhanced theme and settings functionality
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

// Apply all saved settings from localStorage
function loadAndApplySettings() {
    // Load color scheme
    const savedScheme = localStorage.getItem('colorScheme') || 'dark';
    applyColorScheme(savedScheme);

    // Load font size
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    applyFontSize(savedFontSize);

    // Load animation settings
    const savedAnimations = localStorage.getItem('animations') !== 'false';
    applyAnimationSettings(savedAnimations);

    // Load reduced motion
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    applyReducedMotion(savedReducedMotion);

    // Load auto-save forms
    const autoSave = localStorage.getItem('autoSaveForms') !== 'false';
    applyAutoSave(autoSave);
}

function applyColorScheme(scheme) {
    const root = document.documentElement;

    switch(scheme) {
        case 'light':
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--nav-bg', '#f8f9fa');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--secondary-text', '#666666');
            root.style.setProperty('--border-color', '#e1e5e9');
            root.style.setProperty('--accent-primary', '#780000');
            root.style.setProperty('--accent-secondary', '#a30000');
            root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #780000, #333333)');
            root.style.setProperty('--gradient-secondary', 'linear-gradient(135deg, #a30000, #780000)');
            root.style.setProperty('--gradient-tertiary', 'linear-gradient(45deg, #780000, #333333, #780000)');
            document.documentElement.setAttribute('data-theme', 'light');
            break;

        case 'blue':
            root.style.setProperty('--bg-color', '#0f1419');
            root.style.setProperty('--nav-bg', '#1a2332');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--secondary-text', '#94a3b8');
            root.style.setProperty('--border-color', '#334155');
            root.style.setProperty('--accent-primary', '#0093e9');
            root.style.setProperty('--accent-secondary', '#80d0c7');
            root.style.setProperty('--gradient-primary', 'linear-gradient(90deg, #0093e9 0%, #80d0c7 100%)');
            document.documentElement.setAttribute('data-theme', 'dark');
            break;

        case 'purple':
            root.style.setProperty('--bg-color', '#1a0933');
            root.style.setProperty('--nav-bg', '#2d1b47');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--secondary-text', '#c084fc');
            root.style.setProperty('--border-color', '#4c1d95');
            root.style.setProperty('--accent-primary', '#8b5cf6');
            root.style.setProperty('--accent-secondary', '#ec4899');
            root.style.setProperty('--gradient-primary', 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)');
            document.documentElement.setAttribute('data-theme', 'dark');
            break;

        case 'green':
            root.style.setProperty('--bg-color', '#0f1b0f');
            root.style.setProperty('--nav-bg', '#1a2e1a');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--secondary-text', '#86efac');
            root.style.setProperty('--border-color', '#166534');
            root.style.setProperty('--accent-primary', '#10b981');
            root.style.setProperty('--accent-secondary', '#059669');
            root.style.setProperty('--gradient-primary', 'linear-gradient(90deg, #10b981 0%, #059669 100%)');
            document.documentElement.setAttribute('data-theme', 'dark');
            break;

        case 'auto':
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyColorScheme(isDark ? 'dark' : 'light');
            return;

        default: // dark
            root.style.setProperty('--bg-color', '#000000');
            root.style.setProperty('--nav-bg', '#0a0a0a');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--secondary-text', '#cccccc');
            root.style.setProperty('--border-color', '#333333');
            root.style.setProperty('--accent-primary', '#780000');
            root.style.setProperty('--accent-secondary', '#a30000');
            root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #780000, #000000)');
            document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function applyFontSize(size) {
    const root = document.documentElement;

    switch(size) {
        case 'small':
            root.style.setProperty('--base-font-size', '14px');
            break;
        case 'large':
            root.style.setProperty('--base-font-size', '18px');
            break;
        default: // medium
            root.style.setProperty('--base-font-size', '16px');
    }
}

function applyAnimationSettings(enabled) {
    if (enabled) {
        document.body.classList.remove('no-animations');
    } else {
        document.body.classList.add('no-animations');
    }
}

function applyReducedMotion(enabled) {
    if (enabled) {
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
}

function applyAutoSave(enabled) {
    if (enabled) {
        document.body.classList.add('auto-save-enabled');
        enableAutoSave();
    } else {
        document.body.classList.remove('auto-save-enabled');
    }
}

// Search functionality
function openSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    if (searchContainer && searchInput) {
        searchContainer.style.display = 'flex';
        searchInput.focus();
        showSearchSuggestions();
    }
}

function showSearchSuggestions() {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

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
            question: "Where is the Roblox profile?",
            keywords: ["roblox", "profile", "account"]
        },
        {
            question: "How to change theme?",
            keywords: ["theme", "dark mode", "light mode", "color"]
        },
        {
            question: "Where to find social media links?",
            keywords: ["social media", "links", "youtube", "twitter"]
        }
    ];

    // Create suggestions container if it doesn't exist
    let suggestionsContainer = searchResults.querySelector('.search-suggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        searchResults.appendChild(suggestionsContainer);
    }

    // Add suggestion buttons
    suggestionsContainer.innerHTML = commonQuestions
        .map(item => `
            <button class="search-suggestion" 
                onclick="performSearch('${item.question}')"
                data-keywords="${item.keywords.join(' ')}">
                ${item.question}
            </button>
        `).join('');

    searchResults.style.display = 'block';
}

function performSearch(query) {
    const searchText = query.toLowerCase();
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');

    // Find matching elements
    const contentElements = document.querySelectorAll(
        'main p, main h1, main h2, main h3, main li, main span, ' + 
        '.hero p, .hero h1, ' +
        '.about p, .about h1, .about h2, .about h3, ' +
        '.contact p, .contact h1, .contact h2, ' +
        '.updates-container p, .updates-container h1, .updates-container h2, ' +
        '.private-server p, .private-server h1, .private-server h2'
    );

    let firstMatch = null;

    contentElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(searchText) && !firstMatch) {
            firstMatch = element;
        }
    });

    if (firstMatch) {
        // Close search container
        if (searchContainer) {
            searchContainer.style.display = 'none';
        }

        // Clear search input
        if (searchInput) {
            searchInput.value = '';
        }

        // Scroll to the match
        const offset = 100;
        const elementPosition = firstMatch.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
    }
}

// Roblox profile integration
async function updateRobloxProfile() {
    const profile = {
        userId: '5255024681',
        username: 'Masg685'
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
        avatarElement.src = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-5929DDFE20EB1B4D7B3C06D885B0627E-Png/150/150/AvatarHeadshot/Webp/noFilter';
        avatarElement.style.opacity = '1';
    };

    try {
        const response = await fetch(`https://users.roblox.com/v1/users/${profile.userId}`);
        if (response.ok) {
            const data = await response.json();
            usernameElement.textContent = data.displayName || data.name || profile.username;
        }
        usernameElement.textContent = 'Masg685';
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
}

// Loading screen functionality
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Network-aware loading screen
function showLoadingScreenIfNeeded() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Check if this is a fresh visit or refresh (not navigation between pages)
    const isRefresh = performance.navigation.type === performance.navigation.TYPE_RELOAD;
    const isDirectVisit = performance.navigation.type === performance.navigation.TYPE_NAVIGATE && 
                         !document.referrer.includes(window.location.hostname);
    
    // Only show loading screen for fresh visits or refreshes
    if (isRefresh || isDirectVisit || !sessionStorage.getItem('visited')) {
        loadingScreen.style.display = 'flex';
        loadingScreen.classList.remove('fade-out');
        
        // Mark as visited for this session
        sessionStorage.setItem('visited', 'true');
        
        // Network-aware loading duration
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let loadingDuration = 3000; // Default 3 seconds
        
        if (connection) {
            // Adjust loading time based on connection speed
            switch(connection.effectiveType) {
                case 'slow-2g':
                    loadingDuration = 8000; // 8 seconds
                    break;
                case '2g':
                    loadingDuration = 6000; // 6 seconds
                    break;
                case '3g':
                    loadingDuration = 4000; // 4 seconds
                    break;
                case '4g':
                default:
                    loadingDuration = 2000; // 2 seconds
                    break;
            }
        }
        
        // Hide loading screen after calculated duration
        setTimeout(hideLoadingScreen, loadingDuration);
    } else {
        // Hide immediately if navigating between pages
        loadingScreen.style.display = 'none';
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen only if needed
    showLoadingScreenIfNeeded();
    
    // Load and apply all settings first
    loadAndApplySettings();

    // Initialize Roblox profile if on the right page
    if (document.getElementById('roblox-profile')) {
        updateRobloxProfile();
    }

    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileNavLinks = document.querySelector('.nav-links');

    if (hamburger && mobileNavLinks) {
        // Add hamburger lines if not already present
        if (!hamburger.querySelector('span')) {
            hamburger.innerHTML = '<span></span>';
        }

        hamburger.style.display = 'none';

        // Show hamburger on mobile
        const checkMobileView = () => {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'flex';
                if (!mobileNavLinks.classList.contains('active')) {
                    mobileNavLinks.classList.remove('active');
                }
            } else {
                hamburger.style.display = 'none';
                hamburger.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            }
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileNavLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            }
        });

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
    const searchToggle = document.querySelector('.search-toggle');
    if (searchToggle) {
        searchToggle.addEventListener('click', openSearch);
    }

    // Add search input handlers
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });

        searchInput.addEventListener('input', function(e) {
            const query = this.value.trim();
            if (query.length >= 2) {
                // Simple search functionality for real-time
                performSearch(query);
            } else {
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
        }
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer) {
            searchContainer.style.display = 'none';
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
            window.location.href = 'https://www.roblox.com/games/start?placeId=7711635737&launchData=joinCode%3Dpgisejpb';
        });
    }

    // Rules Modal functionality
    const rulesButton = document.querySelector('.rules-button');
    const rulesModal = document.getElementById('rules-modal');
    const closeButton = document.querySelector('.close-button');

    if (rulesButton && rulesModal) {
        rulesButton.addEventListener('click', () => {
            rulesModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeButton && rulesModal) {
        closeButton.addEventListener('click', () => {
            rulesModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    if (rulesModal) {
        rulesModal.addEventListener('click', (e) => {
            if (e.target === rulesModal) {
                rulesModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // Copy join code functionality
    const copyJoinCodeBtn = document.getElementById('copy-join-code');
    const joinCodeInput = document.getElementById('join-code-box');

    if (copyJoinCodeBtn && joinCodeInput) {
        copyJoinCodeBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(joinCodeInput.value);
                const originalText = copyJoinCodeBtn.textContent;
                copyJoinCodeBtn.textContent = 'Copied!';
                copyJoinCodeBtn.style.background = '#4CAF50';
                setTimeout(() => {
                    copyJoinCodeBtn.textContent = originalText;
                    copyJoinCodeBtn.style.background = '#5865F2';
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                joinCodeInput.select();
                document.execCommand('copy');
                const originalText = copyJoinCodeBtn.textContent;
                copyJoinCodeBtn.textContent = 'Copied!';
                copyJoinCodeBtn.style.background = '#4CAF50';
                setTimeout(() => {
                    copyJoinCodeBtn.textContent = originalText;
                    copyJoinCodeBtn.style.background = '#5865F2';
                }, 2000);
            }
        });
    }

    // Discord member count and list (real Discord API data)
    const discordMembersElement = document.getElementById('discord-members');
    const discordMemberListElement = document.getElementById('discord-member-list');

    async function fetchDiscordMembers() {
        try {
            // Discord invite code: KfEWSHyDMS
            const inviteCode = 'KfEWSHyDMS';
            const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                
                if (discordMembersElement && data.approximate_member_count) {
                    discordMembersElement.textContent = data.approximate_member_count;
                }

                // For member list, we'll show online members from the guild info
                if (discordMemberListElement && data.guild) {
                    const guildName = data.guild.name;
                    const onlineCount = data.approximate_presence_count || 0;
                    
                    discordMemberListElement.innerHTML = `
                        <div style="padding: 8px; text-align: center; font-weight: bold; color: #5865F2;">
                            ${guildName}
                        </div>
                        <div style="padding: 4px 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            👑 Masg685 (Owner)
                        </div>
                        <div style="padding: 4px 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            👨‍💼 Nexus (Manager)
                        </div>
                        <div style="padding: 8px; text-align: center; color: #00ff00;">
                            🟢 ${onlineCount} members online
                        </div>
                        <div style="padding: 4px 8px; font-size: 0.9em; color: #888;">
                            Join our Discord to see all members!
                        </div>
                    `;
                }
            } else {
                throw new Error('Failed to fetch Discord data');
            }
        } catch (error) {
            console.error('Error fetching Discord members:', error);
            
            // Fallback display when API fails
            if (discordMembersElement) {
                discordMembersElement.textContent = '50+';
            }
            
            if (discordMemberListElement) {
                discordMemberListElement.innerHTML = `
                    <div style="padding: 8px; text-align: center; font-weight: bold; color: #5865F2;">
                        AUSRP Discord
                    </div>
                    <div style="padding: 4px 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        👑 Masg685 (Owner)
                    </div>
                    <div style="padding: 4px 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        👨‍💼 Nexus (Manager)
                    </div>
                    <div style="padding: 8px; text-align: center; color: #ff9800;">
                        Unable to load member list
                    </div>
                    <div style="padding: 4px 8px; font-size: 0.9em; color: #888;">
                        Join our Discord to see all members!
                    </div>
                `;
            }
        }
    }

    if (discordMembersElement || discordMemberListElement) {
        fetchDiscordMembers();
    }

    // Initialize sounds for mobile
    initializeSounds();

    // Add touch event listeners for mobile
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const soundId = button.getAttribute('data-sound');
            if (soundId) {
                playSound(soundId);
            }
        });
    });

    // Enable auto-save if enabled
    const autoSaveEnabled = localStorage.getItem('autoSaveForms') !== 'false';
    if (autoSaveEnabled) {
        enableAutoSave();
    }

    // Initialize settings page functionality if on settings page
    if (window.location.pathname.includes('settings.html') || window.location.href.includes('settings.html')) {
        console.log('Detected settings page, initializing...');
        
        // Force immediate initialization
        initializeSettings();
        setupSettingsEventListeners();
        
        // Use multiple timing checks to ensure initialization with longer delays
        setTimeout(() => {
            initializeSettings();
            setupSettingsEventListeners();
        }, 100);
        
        setTimeout(() => {
            initializeSettings();
            setupSettingsEventListeners();
        }, 500);
        
        setTimeout(() => {
            initializeSettings();
            setupSettingsEventListeners();
        }, 1000);
        
        setTimeout(() => {
            initializeSettings();
            setupSettingsEventListeners();
        }, 2000);
        
        // Also try when the page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                initializeSettings();
                setupSettingsEventListeners();
            }, 200);
        });
        
        // Try again after a longer delay to ensure everything is ready
        setTimeout(() => {
            initializeSettings();
            setupSettingsEventListeners();
        }, 3000);
    }

    // Loading screen is handled by showLoadingScreenIfNeeded() above
});

// Settings page functions
function initializeSettings() {
    try {
        // Check if we're actually on the settings page
        if (!document.querySelector('.settings-container')) {
            return;
        }

        console.log('Initializing settings page...');

        // Get saved settings with fallbacks
        const savedScheme = localStorage.getItem('colorScheme') || 'dark';
        const savedAnimations = localStorage.getItem('animations') !== 'false';
        const savedSounds = localStorage.getItem('sounds') !== 'false';
        const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
        const savedFontSize = localStorage.getItem('fontSize') || 'medium';
        const savedHighContrast = localStorage.getItem('highContrast') === 'true';
        const savedFocusIndicators = localStorage.getItem('focusIndicators') !== 'false';
        const savedAutoSave = localStorage.getItem('autoSaveForms') !== 'false';
        const savedPreloadImages = localStorage.getItem('preloadImages') !== 'false';
        const savedRememberPrefs = localStorage.getItem('rememberPreferences') !== 'false';
        const savedAnalytics = localStorage.getItem('analytics') === 'true';

        console.log('Current saved scheme:', savedScheme);

        // Apply color scheme first
        applyColorScheme(savedScheme);

        // Wait for DOM elements to be ready with more robust checking
        const initializeToggles = () => {
            // Initialize toggles
            const animationsToggle = document.getElementById('animations-toggle');
            if (animationsToggle) {
                animationsToggle.checked = savedAnimations;
                console.log('Set animations toggle:', savedAnimations);
            }

            const soundsToggle = document.getElementById('sounds-toggle');
            if (soundsToggle) soundsToggle.checked = savedSounds;

            const reducedMotionToggle = document.getElementById('reduced-motion-toggle');
            if (reducedMotionToggle) reducedMotionToggle.checked = savedReducedMotion;

            const highContrastToggle = document.getElementById('high-contrast-toggle');
            if (highContrastToggle) highContrastToggle.checked = savedHighContrast;

            const focusIndicatorsToggle = document.getElementById('focus-indicators-toggle');
            if (focusIndicatorsToggle) focusIndicatorsToggle.checked = savedFocusIndicators;

            const autoSaveToggle = document.getElementById('auto-save-toggle');
            if (autoSaveToggle) autoSaveToggle.checked = savedAutoSave;

            const preloadImagesToggle = document.getElementById('preload-images-toggle');
            if (preloadImagesToggle) preloadImagesToggle.checked = savedPreloadImages;

            const rememberPrefsToggle = document.getElementById('remember-preferences-toggle');
            if (rememberPrefsToggle) rememberPrefsToggle.checked = savedRememberPrefs;

            const analyticsToggle = document.getElementById('analytics-toggle');
            if (analyticsToggle) analyticsToggle.checked = savedAnalytics;

            // Apply font size
            applyFontSize(savedFontSize);

            // Mark active scheme and font size with better error handling
            const schemeCards = document.querySelectorAll('.color-scheme-card');
            if (schemeCards.length > 0) {
                schemeCards.forEach(card => card.classList.remove('active'));
                const activeSchemeCard = document.querySelector(`[data-scheme="${savedScheme}"]`);
                if (activeSchemeCard) {
                    activeSchemeCard.classList.add('active');
                    console.log('Set active scheme card:', savedScheme);
                } else {
                    console.warn('Could not find scheme card for:', savedScheme);
                }
            }

            const fontBtns = document.querySelectorAll('.font-btn');
            if (fontBtns.length > 0) {
                fontBtns.forEach(btn => btn.classList.remove('active'));
                const activeFontBtn = document.querySelector(`[data-size="${savedFontSize}"]`);
                if (activeFontBtn) {
                    activeFontBtn.classList.add('active');
                }
            }
        };

        // Initialize with multiple attempts to ensure elements are ready
        const maxAttempts = 10;
        let attempts = 0;
        
        const tryInitialize = () => {
            attempts++;
            const schemeCards = document.querySelectorAll('.color-scheme-card');
            
            if (schemeCards.length > 0 || attempts >= maxAttempts) {
                initializeToggles();
                console.log('Settings initialized after', attempts, 'attempts');
            } else {
                setTimeout(tryInitialize, 100);
            }
        };

        tryInitialize();

    } catch (error) {
        console.error('Error initializing settings:', error);
        // Fallback to default dark theme
        applyColorScheme('dark');
    }
}

function setupSettingsEventListeners() {
    // Check if we're actually on the settings page
    if (!document.querySelector('.settings-container')) {
        return;
    }

    console.log('Setting up settings event listeners...');

    // Wait for elements to be available with retries
    const setupListeners = () => {
        // Color scheme selection with improved event handling
        const schemeCards = document.querySelectorAll('.color-scheme-card');
        console.log('Found scheme cards:', schemeCards.length);
        
        if (schemeCards.length > 0) {
            schemeCards.forEach((card, index) => {
                // Remove existing listeners to prevent duplicates
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
                
                // Add new listener
                newCard.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const scheme = this.getAttribute('data-scheme');
                    console.log('Color scheme clicked:', scheme);
                    if (scheme) {
                        selectColorScheme(scheme);
                    }
                });
                
                console.log('Added listener to scheme card:', index, newCard.getAttribute('data-scheme'));
            });
        }

        // Toggle switches with improved handling
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle && !animationsToggle.hasAttribute('data-listener-added')) {
            animationsToggle.setAttribute('data-listener-added', 'true');
            animationsToggle.addEventListener('change', function() {
                try {
                    localStorage.setItem('animations', this.checked);
                    applyAnimationSettings(this.checked);
                    console.log('Animations setting changed:', this.checked);
                } catch (e) {
                    console.warn('Could not save animations setting:', e);
                }
            });
        }

        const soundsToggle = document.getElementById('sounds-toggle');
        if (soundsToggle && !soundsToggle.hasAttribute('data-listener-added')) {
            soundsToggle.setAttribute('data-listener-added', 'true');
            soundsToggle.addEventListener('change', function() {
                try {
                    localStorage.setItem('sounds', this.checked);
                } catch (e) {
                    console.warn('Could not save sounds setting:', e);
                }
            });
        }

        const reducedMotionToggle = document.getElementById('reduced-motion-toggle');
        if (reducedMotionToggle && !reducedMotionToggle.hasAttribute('data-listener-added')) {
            reducedMotionToggle.setAttribute('data-listener-added', 'true');
            reducedMotionToggle.addEventListener('change', function() {
                try {
                    localStorage.setItem('reducedMotion', this.checked);
                    applyReducedMotion(this.checked);
                } catch (e) {
                    console.warn('Could not save reduced motion setting:', e);
                }
            });
        }

        // Font size buttons with improved handling
        const fontBtns = document.querySelectorAll('.font-btn');
        if (fontBtns.length > 0) {
            fontBtns.forEach((btn, index) => {
                if (!btn.hasAttribute('data-listener-added')) {
                    btn.setAttribute('data-listener-added', 'true');
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const size = this.getAttribute('data-size');
                        console.log('Font size clicked:', size);
                        if (size) {
                            selectFontSize(size);
                        }
                    });
                    console.log('Added listener to font button:', index, btn.getAttribute('data-size'));
                }
            });
        }
    };

    // Try multiple times with longer delays to ensure elements are ready
    const maxAttempts = 10;
    let attempts = 0;
    
    const trySetupListeners = () => {
        attempts++;
        const schemeCards = document.querySelectorAll('.color-scheme-card');
        
        if (schemeCards.length > 0 || attempts >= maxAttempts) {
            setupListeners();
            console.log('Event listeners set up after', attempts, 'attempts');
        } else {
            setTimeout(trySetupListeners, 200);
        }
    };

    trySetupListeners();
}

// Separate handler functions to prevent duplicates
function handleColorSchemeClick() {
    const scheme = this.getAttribute('data-scheme');
    selectColorScheme(scheme);
}

function handleFontSizeClick() {
    const size = this.getAttribute('data-size');
    selectFontSize(size);
}

function selectColorScheme(scheme) {
    console.log('Selecting color scheme:', scheme);
    
    try {
        // Save to localStorage first
        try {
            localStorage.setItem('colorScheme', scheme);
            localStorage.setItem('theme', scheme === 'light' ? 'light' : 'dark');
            console.log('Saved scheme to localStorage:', scheme);
        } catch (e) {
            console.error('Could not save to localStorage:', e);
        }

        // Apply the color scheme immediately with force
        applyColorScheme(scheme);
        console.log('Applied color scheme:', scheme);
        
        // Force multiple style updates
        setTimeout(() => {
            applyColorScheme(scheme);
            document.documentElement.setAttribute('data-theme', scheme === 'light' ? 'light' : 'dark');
        }, 50);
        
        setTimeout(() => {
            applyColorScheme(scheme);
        }, 100);

        // Remove active class from all cards
        const allCards = document.querySelectorAll('.color-scheme-card');
        allCards.forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected card
        const selectedCard = document.querySelector(`[data-scheme="${scheme}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
            console.log('Added active class to selected card');
        } else {
            console.warn('Could not find selected card for scheme:', scheme);
        }
        
        // Force a style recalculation and reflow
        document.documentElement.style.setProperty('--force-update', Math.random());
        document.body.offsetHeight; // Force reflow
        
        // Force repaint
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
        
        // Show feedback to user
        const feedback = document.createElement('div');
        feedback.textContent = `Theme changed to ${scheme}`;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error in selectColorScheme:', error);
        // Fallback - try to apply the scheme anyway
        applyColorScheme(scheme);
    }
}

function selectFontSize(size) {
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const selectedBtn = document.querySelector(`[data-size="${size}"]`);
    if (selectedBtn) selectedBtn.classList.add('active');

    applyFontSize(size);
    localStorage.setItem('fontSize', size);
}

// Reset settings function
function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        const settingsKeys = [
            'colorScheme', 'theme', 'animations', 'sounds', 'reducedMotion', 
            'fontSize', 'highContrast', 'focusIndicators', 'autoSaveForms', 
            'preloadImages', 'rememberPreferences', 'analytics'
        ];

        settingsKeys.forEach(key => localStorage.removeItem(key));

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('form_')) {
                localStorage.removeItem(key);
            }
        });

        window.location.reload();
    }
}

// Auto-save functionality
function enableAutoSave() {
    document.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(input => {
        if (input.type === 'password') return;

        const saveKey = `autosave_${window.location.pathname}_${input.name || input.id || input.placeholder}`;

        const savedValue = localStorage.getItem(saveKey);
        if (savedValue && !input.value) {
            input.value = savedValue;
        }

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                localStorage.setItem(saveKey, this.value);
            } else {
                localStorage.removeItem(saveKey);
            }
        });

        const form = input.closest('form');
        if (form) {
            form.addEventListener('submit', function() {
                localStorage.removeItem(saveKey);
            });
        }
    });
}

// Chat system
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const chatStatus = document.getElementById('chat-status');

if (chatForm && chatMessages && chatStatus) {
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const message = document.getElementById('chat-input').value;

        const messageDiv = document.createElement('p');
        messageDiv.textContent = `You: ${message}`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const formData = new FormData();
        formData.append('message', message);
        formData.append('_subject', 'New Chat Message');

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
                }, 3000);
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

        chatForm.reset();
    });
}

// Post functionality
const ADMIN_PASSWORD = 'Masg68525!';
let posts = JSON.parse(localStorage.getItem('posts') || '[]');

function login() {
    const password = document.getElementById('password').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('post-form').style.display = 'block';
        document.getElementById('password').value = '';

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 50);
        localStorage.setItem('adminSession', expiryDate.toISOString());
    } else {
        alert('Incorrect password');
    }
}

// Sound effects functionality
const sounds = {
    hit1: new Audio('sounds/1 hit .mp3'),
    hit2: new Audio('sounds/2 hits .mp3'),
    hit3: new Audio('sounds/3 hits.mp3'),
    hit4: new Audio('sounds/4 hits.mp3')
};

function initializeSounds() {
    Object.values(sounds).forEach(sound => {
        sound.preload = 'auto';
        sound.playsinline = true;
        sound.muted = false;
        sound.load();
    });
}

function playSound(soundId) {
    const sound = sounds[soundId];
    if (!sound) return;

    Object.values(sounds).forEach(s => {
        s.pause();
        s.currentTime = 0;
    });

    const playPromise = sound.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            sound.volume = 1.0;
        }).catch(error => {
            console.log("Playback failed:", error);
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

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = soundPath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}

// Navigation function
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'home.html';
    }
}

// Listen for system theme changes when auto mode is enabled
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        const savedScheme = localStorage.getItem('colorScheme');
        if (savedScheme === 'auto') {
            applyColorScheme('auto');
        }
    });
}

// Image download functionality
function downloadImage(imageSrc, fileName) {
    try {
        // Create a temporary link element
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = imageSrc;
        link.download = fileName || 'image';
        
        // Add cross-origin attribute for external images
        link.setAttribute('crossorigin', 'anonymous');
        
        // Append to body and trigger download
        document.body.appendChild(link);
        
        // For mobile Safari compatibility
        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
            link.target = '_blank';
        }
        
        link.click();
        
        // Clean up
        setTimeout(() => {
            if (document.body.contains(link)) {
                document.body.removeChild(link);
            }
        }, 100);
        
        // Show feedback to user
        showDownloadFeedback('Image downloaded successfully!');
        
    } catch (error) {
        console.error('Download failed:', error);
        showDownloadFeedback('Download failed. Please try again.', true);
    }
}

// Show download feedback to user
function showDownloadFeedback(message, isError = false) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.download-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'download-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#ff4444' : '#4CAF50'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(feedback)) {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(feedback)) {
                    document.body.removeChild(feedback);
                }
            }, 300);
        }
    }, 3000);
}

async function downloadAllImages() {
    const images = [
        { src: 'img8.jpg', name: 'Masg685_Image_8.jpg' },
        { src: 'img9.jpg', name: 'Masg685_Image_9.jpg' },
        { src: 'img10.png', name: 'Masg685_Image_10.png' },
        { src: 'img11.png', name: 'Masg685_Image_11.png' },
        { src: 'img12.png', name: 'Masg685_Image_12.png' },
        { src: 'img13.png', name: 'Masg685_Image_13.png' },
        { src: 'img14.jpg', name: 'Masg685_Image_14.jpg' },
        { src: 'img15.jpg', name: 'Masg685_Image_15.jpg' },
        { src: 'img16.jpg', name: 'Masg685_Image_16.jpg' }
    ];

    const downloadAllBtn = document.querySelector('.download-all-button');
    const originalText = downloadAllBtn.innerHTML;
    
    // Show progress
    downloadAllBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    downloadAllBtn.disabled = true;

    // Download each image with a small delay
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        downloadImage(image.src, image.name);
        
        // Update progress
        downloadAllBtn.innerHTML = `<i class="fas fa-download"></i> Downloaded ${i + 1}/${images.length}`;
        
        // Small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Reset button
    downloadAllBtn.innerHTML = '<i class="fas fa-check"></i> All Downloaded!';
    downloadAllBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
        downloadAllBtn.innerHTML = originalText;
        downloadAllBtn.style.background = '';
        downloadAllBtn.disabled = false;
    }, 3000);
}

// Make functions globally available
window.openSearch = openSearch;
window.performSearch = performSearch;
window.resetSettings = resetSettings;
window.selectColorScheme = selectColorScheme;
window.selectFontSize = selectFontSize;
window.login = login;
window.playSound = playSound;
window.downloadSound = downloadSound;
window.downloadImage = downloadImage;
window.downloadAllImages = downloadAllImages;
window.goBack = goBack;