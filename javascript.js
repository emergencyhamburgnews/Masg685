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

// Language translations
const translations = {
    en: {
        // Navigation
        home: 'Home',
        about: 'About',
        contact: 'Contact',
        updates: 'Updates',
        privateServer: 'Private Server',
        tiktokDownloader: 'TikTok Downloader',
        language: 'Language',
        
        // About page
        aboutMe: 'About Me',
        aboutText: 'Hi, my nickname is Masg685 and I\'m from Australia. I was born on the island of Savai\'i in Samoa. In 2023, I started playing Emergency Hamburg, a roleplay game from Germany. I\'ve earned over 300,000 XP as a police officer, which is known as one of the best teams in the game.',
        socialMedia: 'Later, I started creating content on social media — beginning with YouTube and then expanding to TikTok. If you haven\'t subscribed yet, please do — it really helps me out!',
        
        // Private server section
        privateServerTitle: 'private-server',
        privateServerInfo: 'I will be creating a',
        privateServerText: 'in Emergency Hamburg, and once controller support is added in the next update.',
        
        // Game stats
        emergencyHamburg: 'Emergency Hamburg',
        gamepass: 'Gamepass:',
        policeXp: 'Police Xp:',
        fireAndMedicalXp: 'Fire & Medical Xp:',
        xpTotal: 'XP Total',
        plusSix: '+6',
        plus312213: '+312,213',
        plus20352: '+20,352',
        
        // Common elements
        search: 'Search...',
        scrollTop: 'Scroll to top',
        welcome: 'Welcome to my personal site',
        findInfo: 'you can find information about me',
        here: 'here',
        
        // Help Center
        helpCenter: 'Help Center',
        searchQuestions: 'Search questions...',
        howToUse: 'How to use',
        whoIs: 'Who is',
        howToReport: 'How to Report',
        
        // Contact Form
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        message: 'Message',
        send: 'Send',
        messageSent: 'Message sent successfully!',
        
        // Server Status
        serverStatus: 'Server Status',
        online: 'Online',
        offline: 'Offline',
        players: 'Players',
        
        // Buttons
        joinDiscord: 'Join Discord',
        joinServer: 'Join Server',
        viewRules: 'View Rules',
        reportPlayer: 'Report Player',
        unbanRequest: 'Unban Request'
    },
    vi: {
        // Navigation
        home: 'Trang chủ',
        about: 'Giới thiệu',
        contact: 'Liên hệ',
        updates: 'Cập nhật',
        privateServer: 'Máy chủ riêng',
        tiktokDownloader: 'Tải TikTok',
        language: 'Ngôn ngữ',
        
        // About page
        aboutMe: 'Giới thiệu về tôi',
        aboutText: 'Xin chào, biệt danh của tôi là Masg685 và tôi đến từ Úc. Tôi sinh ra trên đảo Savai\'i ở Samoa. Năm 2023, tôi bắt đầu chơi Emergency Hamburg, một trò chơi nhập vai từ Đức. Tôi đã đạt được hơn 300.000 XP với vai trò cảnh sát, được biết đến là một trong những đội tốt nhất trong trò chơi.',
        socialMedia: 'Sau đó, tôi bắt đầu tạo nội dung trên mạng xã hội — bắt đầu với YouTube và sau đó mở rộng sang TikTok. Nếu bạn chưa đăng ký, hãy đăng ký nhé — điều đó thực sự giúp ích cho tôi!',
        
        // Private server section
        privateServerTitle: 'máy-chủ-riêng',
        privateServerInfo: 'Tôi sẽ tạo một',
        privateServerText: 'trong Emergency Hamburg, và khi hỗ trợ bộ điều khiển được thêm vào trong bản cập nhật tiếp theo.',
        
        // Game stats
        emergencyHamburg: 'Emergency Hamburg',
        gamepass: 'Gamepass:',
        policeXp: 'Điểm Cảnh sát:',
        fireAndMedicalXp: 'Điểm Cứu hỏa & Y tế:',
        xpTotal: 'Tổng XP',
        plusSix: '+6',
        plus312213: '+312.213',
        plus20352: '+20.352',
        
        // Common elements
        search: 'Tìm kiếm...',
        scrollTop: 'Cuộn lên trên',
        welcome: 'Chào mừng đến trang web của tôi',
        findInfo: 'bạn có thể tìm thông tin về tôi',
        here: 'tại đây',
        
        // Help Center
        helpCenter: 'Trung tâm trợ giúp',
        searchQuestions: 'Tìm kiếm câu hỏi...',
        howToUse: 'Cách sử dụng',
        whoIs: 'Ai là',
        howToReport: 'Cách báo cáo',
        
        // Contact Form
        yourName: 'Tên của bạn',
        yourEmail: 'Email của bạn',
        message: 'Tin nhắn',
        send: 'Gửi',
        messageSent: 'Đã gửi tin nhắn thành công!',
        
        // Server Status
        serverStatus: 'Trạng thái máy chủ',
        online: 'Đang hoạt động',
        offline: 'Ngoại tuyến',
        players: 'Người chơi',
        
        // Buttons
        joinDiscord: 'Tham gia Discord',
        joinServer: 'Tham gia máy chủ',
        viewRules: 'Xem luật',
        reportPlayer: 'Báo cáo người chơi',
        unbanRequest: 'Yêu cầu gỡ cấm'
    },
    sm: {
        // Navigation
        home: 'Amataga',
        about: 'E uiga',
        contact: 'Fesootai',
        updates: 'Faafou',
        privateServer: 'Server Patino',
        tiktokDownloader: 'TikTok Download',
        language: 'Gagana',
        
        // About page
        aboutMe: 'E uiga ia te au',
        aboutText: 'Talofa, o lo\'u igoa faaigoaina o Masg685 ma ou sau mai Ausetalia. Na ou fanau i le motu o Savai\'i i Samoa. I le 2023, na amata ona ou taalo i le Emergency Hamburg, o se taaloga roleplay mai Siamani. Ua ou maua le sili atu i le 300,000 XP o se leoleo, o le tasi lea o au\'auna sili ona lelei i le taaloga.',
        socialMedia: 'Mulimuli ane, na amata ona ou faia ni ata i luga o upega feso\'ota\'i — amata i le YouTube ona sosolo atu lea i le TikTok. Afai e te le\'i subscribe, fa\'amolemole fai — e fesoasoani tele ia te a\'u!',
        
        // Private server section
        privateServerTitle: 'server-patino',
        privateServerInfo: 'O le a ou faia se',
        privateServerText: 'i le Emergency Hamburg, ma pe a fa\'aopoopo le controller support i le fa\'afouina o le lumana\'i.',
        
        // Game stats
        emergencyHamburg: 'Emergency Hamburg',
        gamepass: 'Gamepass:',
        policeXp: 'Leoleo Xp:',
        fireAndMedicalXp: 'Tinei Afi & Soifua Maloloina Xp:',
        xpTotal: 'Aofai XP',
        plusSix: '+6',
        plus312213: '+312,213',
        plus20352: '+20,352',
        
        // Common elements
        search: 'Saili...',
        scrollTop: 'Scroll i luga',
        welcome: 'Afio mai i lau upega tafailagi',
        findInfo: 'e mafai ona e maua faamatalaga e uiga ia te au',
        here: 'iinei',
        
        // Help Center
        helpCenter: 'Nofoaga Fesoasoani',
        searchQuestions: 'Saili fesili...',
        howToUse: 'Fa\'afefea ona fa\'aoga',
        whoIs: 'O ai',
        howToReport: 'Auala e Lipoti ai',
        
        // Contact Form
        yourName: 'Lou Igoa',
        yourEmail: 'Lau Imeli',
        message: 'Feau',
        send: 'Lafo',
        messageSent: 'Ua maea ona lafo le feau!',
        
        // Server Status
        serverStatus: 'Tulaga o le Server',
        online: 'Ua Online',
        offline: 'Ua Offline',
        players: 'Tagata Taalo',
        
        // Buttons
        joinDiscord: 'Auai i le Discord',
        joinServer: 'Auai i le Server',
        viewRules: 'Va\'ai Tulafono',
        reportPlayer: 'Lipoti Tagata Taalo',
        unbanRequest: 'Talosaga mo le Unban'
    }
};

// Function to apply translations
function applyTranslations(lang) {
    // First handle elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Then handle automatic translation for all text content
    function translateTextNodes(node) {
        if (node.nodeType === 3) { // Text node
            const text = node.textContent.trim();
            if (text && text.length > 1) { // Only translate non-empty text
                // Try to find translation
                for (const [key, value] of Object.entries(translations['en'])) {
                    if (value === text) {
                        const translation = translations[lang][key];
                        if (translation) {
                            node.textContent = translation;
                            break;
                        }
                    }
                }
            }
        } else if (node.nodeType === 1) { // Element node
            // Skip script and style tags
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                // Also translate placeholder and value attributes for inputs
                if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                    if (node.placeholder) {
                        for (const [key, value] of Object.entries(translations['en'])) {
                            if (value === node.placeholder) {
                                const translation = translations[lang][key];
                                if (translation) {
                                    node.placeholder = translation;
                                    break;
                                }
                            }
                        }
                    }
                    if (node.value && node.type !== 'password' && node.type !== 'email') {
                        for (const [key, value] of Object.entries(translations['en'])) {
                            if (value === node.value) {
                                const translation = translations[lang][key];
                                if (translation) {
                                    node.value = translation;
                                    break;
                                }
                            }
                        }
                    }
                }
                // Recursively translate child nodes
                node.childNodes.forEach(child => translateTextNodes(child));
            }
        }
    }

    // Start translation from body to avoid affecting scripts
    const body = document.body;
    if (body) {
        translateTextNodes(body);
    }
}

// Function to change language
function changeLanguage(lang) {
    if (!translations[lang]) return;
    
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.setAttribute('lang', lang);
    applyTranslations(lang);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add language selector to navigation
    const navigationLinks = document.querySelector('.nav-links');
    if (navigationLinks) {
        // Adjust all navigation items to be slightly smaller
        document.querySelectorAll('.nav-item').forEach(item => {
            item.style.fontSize = '14px';
        });

        // Adjust icons to be slightly smaller
        document.querySelectorAll('.nav-item i').forEach(icon => {
            icon.style.fontSize = '14px';
        });

        const langSelector = document.createElement('li');
        langSelector.className = 'nav-item';
        langSelector.innerHTML = `
            <select onchange="changeLanguage(this.value)" style="background: transparent; color: white; border: none; padding: 0; margin: 0; cursor: pointer; font-size: 14px; font-family: inherit; -webkit-appearance: none; -moz-appearance: none; appearance: none; text-decoration: none; outline: none;">
                <option value="" disabled selected>Language</option>
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="sm">Gagana Sāmoa</option>
            </select>
        `;
        navigationLinks.appendChild(langSelector);

        // Update the selected option based on current language
        const updateSelectedLanguage = () => {
            const currentLang = localStorage.getItem('selectedLanguage') || 'en';
            const select = langSelector.querySelector('select');
            if (select) {
                select.value = currentLang;
            }
        };

        // Update on load
        updateSelectedLanguage();
    }

    // Apply saved language or default to English
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    const langSelect = document.querySelector('.lang-selector select');
    if (langSelect) {
        langSelect.value = savedLang;
    }
    applyTranslations(savedLang);

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
                mobileNavLinks.classList.remove('active');
            } else {
                hamburger.style.display = 'none';
                mobileNavLinks.classList.remove('active');
            }
        };

        // Check on load and resize
        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        hamburger.addEventListener('click', () => {
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
        title: 'Website Updates - October 2023',
        content: `🔄 Recent Changes and Updates:

✨ New Features Added:
- Multi-language support (English, Vietnamese, Samoan)
- Language selector in navigation
- Improved Help Center with predefined questions
- Enhanced search functionality
- Better mobile responsiveness

🛠️ Fixed Issues:
- Mobile menu button visibility
- Scroll-to-top button styling
- Roblox profile avatar loading
- Navigation layout and spacing
- Text size adjustments

❌ Removed Features:
- Direct AI chat responses (replaced with predefined Q&A)
- Old search system
- Previous language implementation

💡 Previous Features Still Available:
- TikTok Downloader
- Private Server information
- Contact form
- Server status
- User reporting system
- Unban request system

All these changes aim to improve website performance and user experience while maintaining core functionality.`,
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