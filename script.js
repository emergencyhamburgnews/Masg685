// Global variable to store website data
let websiteData = {};

// Error Sound System
class ErrorSoundSystem {
    constructor() {
        this.audio = null;
        this.volume = 0.5; // 50% volume as requested
        this.initializeAudio();
    }

    initializeAudio() {
        try {
            // Create audio element for error sound
            this.audio = new Audio('error message sound.mp3');
            this.audio.volume = this.volume;
            this.audio.preload = 'auto';
            
            // Handle audio loading errors gracefully
            this.audio.addEventListener('error', (e) => {
                console.warn('Error sound file not found or failed to load:', e);
            });
            
            console.log('Error sound system initialized');
        } catch (error) {
            console.warn('Failed to initialize error sound system:', error);
        }
    }

    playErrorSound() {
        try {
            if (this.audio) {
                // Reset audio to beginning and play
                this.audio.currentTime = 0;
                this.audio.volume = this.volume;
                this.audio.play().catch(error => {
                    console.warn('Could not play error sound:', error);
                });
            }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }
}

// Global error sound system instance
const errorSoundSystem = new ErrorSoundSystem();

// Function to play error sound (can be called from anywhere)
function playErrorSound() {
    errorSoundSystem.playErrorSound();
}

// Success Sound System
class SuccessSoundSystem {
    constructor() {
        this.audio = null;
        this.volume = 0.5; // 50% volume as requested
        this.initializeAudio();
    }

    initializeAudio() {
        try {
            // Create audio element for success sound
            this.audio = new Audio('correct message sound.mp3');
            this.audio.volume = this.volume;
            this.audio.preload = 'auto';
            
            // Handle audio loading errors gracefully
            this.audio.addEventListener('error', (e) => {
                console.warn('Success sound file not found or failed to load:', e);
            });
            
            console.log('Success sound system initialized');
        } catch (error) {
            console.warn('Failed to initialize success sound system:', error);
        }
    }

    playSuccessSound() {
        try {
            if (this.audio) {
                // Reset audio to beginning and play
                this.audio.currentTime = 0;
                this.audio.volume = this.volume;
                this.audio.play().catch(error => {
                    console.warn('Could not play success sound:', error);
                });
            }
        } catch (error) {
            console.warn('Error playing success sound:', error);
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
        if (this.audio) {
            this.audio.volume = this.volume;
        }
    }
}

// Global success sound system instance
const successSoundSystem = new SuccessSoundSystem();

// Function to play success sound (can be called from anywhere)
function playSuccessSound() {
    successSoundSystem.playSuccessSound();
}

// Dynamic Theme Color System
function updateThemeColor() {
    const navbarColor = localStorage.getItem('navbarColor') || 'black';
    const theme = localStorage.getItem('theme') || 'light';
    
    let themeColor;
    
    // Set theme color to match navbar colors exactly (copy from CSS)
    switch (navbarColor) {
        case 'black': themeColor = '#000000'; break;  // Exact match from CSS
        case 'red': themeColor = '#dc3545'; break;    // Exact match from CSS
        case 'blue': themeColor = '#4a90e2'; break;   // Exact match from CSS
        case 'green': themeColor = '#27ae60'; break;  // Exact match from CSS
        case 'yellow': themeColor = '#f39c12'; break; // Exact match from CSS
        default: themeColor = '#000000'; // Default to black
    }
    
    // Update the theme-color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', themeColor);
    }
    
    console.log('Theme color updated to:', themeColor, 'for navbar:', navbarColor, 'theme:', theme);
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadWebsiteData();
    initializeTheme();
    initializeNavbarColor();
    initializeGlowColor();
    loadUpdateContent();
    initializeAnimatedGreeting();
    applyNoticeSetting();
    applyGlowColorSetting();
    initializeSearch();
    updateThemeColor(); // Update theme color on page load
});

// Load data from Firebase
async function loadWebsiteData() {
    try {
        // Wait for Firebase content manager to load
        if (window.firebaseContentManager) {
            // Content will be loaded by Firebase content manager
            console.log('Waiting for Firebase content to load...');
            // Set up a listener for when content is ready
            const checkContent = () => {
                if (window.websiteData && Object.keys(window.websiteData).length > 0) {
                    websiteData = window.websiteData;
                    console.log('Firebase content loaded:', websiteData);
                    loadPageContent();
                } else {
                    setTimeout(checkContent, 100);
                }
            };
            checkContent();
        } else {
            // Fallback to default data
            websiteData = getDefaultData();
            loadPageContent();
        }
    } catch (error) {
        console.error('Error loading website data:', error);
        playErrorSound();
        // Fallback to default data
        websiteData = getDefaultData();
        loadPageContent();
    }
}

// Default data fallback
function getDefaultData() {
    return {
        home: {
            title: "Welcome to My Website",
            description: "This is where I share my latest announcements and updates. Stay tuned for exciting news!",
            image: "https://via.placeholder.com/600x400/4a90e2/ffffff?text=Hero+Image"
        },
        about: {
            title: "About Me",
            content: "Welcome to my corner of the internet! I'm passionate about creating amazing experiences and sharing them with the world. This website serves as a platform where I can connect with you and showcase the things I love.\n\nWhen I'm not working on projects, you can find me exploring new ideas, learning about technology, and always looking for ways to make things better. I believe in the power of creativity and innovation to bring people together.\n\nThrough this website, I hope to share my journey, connect with like-minded individuals, and provide value to anyone who visits. Whether you're here to learn about my work, shop for unique items, or just explore, I'm glad you're here!\n\nFeel free to reach out if you have any questions or just want to say hello. I'm always excited to meet new people and hear about their stories too."
        },
        shop: {
            title: "Shop",
            subtitle: "Check out my latest Roblox clothing items!",
            products: [
                {
                    id: 1,
                    name: "Cool Blue Shirt",
                    description: "A stylish blue shirt perfect for any Roblox avatar. Made with premium virtual materials!",
                    image: "https://via.placeholder.com/300x250/4a90e2/ffffff?text=Blue+Shirt",
                    price: 50,
                    buyLink: "#"
                },
                {
                    id: 2,
                    name: "Classic Black Pants",
                    description: "Comfortable and stylish black pants that go with any outfit. A must-have for your wardrobe!",
                    image: "https://via.placeholder.com/300x250/2c3e50/ffffff?text=Black+Pants",
                    price: 75,
                    buyLink: "#"
                },
                {
                    id: 3,
                    name: "Red Gaming Hoodie",
                    description: "Show your gaming spirit with this awesome red hoodie. Perfect for virtual adventures!",
                    image: "https://via.placeholder.com/300x250/e74c3c/ffffff?text=Red+Hoodie",
                    price: 100,
                    buyLink: "#"
                }
            ]
        },
        socialMedia: {
            title: "Social Media",
            logo: "https://via.placeholder.com/50x50/4a90e2/ffffff?text=Logo"
        }
    };
}

// Load content based on current page
function loadPageContent() {
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'home':
            loadHomeContent();
            break;
        case 'about':
            loadAboutContent();
            break;
        case 'shop':
            // loadShopContent(); // Disabled - using static HTML content
            break;
    }
}

// Get current page name from URL
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('about.html')) return 'about';
    if (path.includes('shop.html')) return 'shop';
    return 'home';
}

// Load home page content
function loadHomeContent() {
    if (!websiteData.home) return;
    
    const imageElement = document.getElementById('hero-image');
    const descriptionElement = document.getElementById('hero-description');
    const socialLogoElement = document.getElementById('social-logo');
    
    if (imageElement && websiteData.home.image) {
        imageElement.src = websiteData.home.image;
        imageElement.alt = websiteData.home.title || 'Hero Image';
    }
    
    if (descriptionElement && websiteData.home.description) {
        descriptionElement.textContent = websiteData.home.description;
    }
    
    // Load social media logos and links
    loadSocialMediaContent();
    
    // Update social media meta tags dynamically
    updateSocialMetaTags();
}

// Update social media meta tags for sharing
function updateSocialMetaTags() {
    if (!websiteData.home) return;
    
    const title = websiteData.home.title || 'Masg685 - Emergency Hamburg RP Server';
    const description = websiteData.home.description || 'Join my RP private server in Emergency Hamburg. Experience the best roleplay with over 300,000 XP as police officer!';
    const image = websiteData.home.image || 'img4.jpg';
    
    // Update Open Graph meta tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:image:alt', 'Emergency Hamburg Police Car - Join our RP server');
    updateMetaTag('og:site_name', 'Masg685');
    
    // Update Twitter Card meta tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:image:alt', 'Emergency Hamburg Police Car - Join our RP server');
    
    // Update general meta description
    updateMetaTag('description', description);
    
    // Update page title
    document.title = title;
}

// Helper function to update meta tags
function updateMetaTag(property, content) {
    // Handle both property and name attributes
    const selectors = [
        `meta[property="${property}"]`,
        `meta[name="${property}"]`
    ];
    
    selectors.forEach(selector => {
        const metaTag = document.querySelector(selector);
        if (metaTag) {
            metaTag.setAttribute('content', content);
        }
    });
}

// Load social media content
function loadSocialMediaContent() {
    if (!websiteData.socialMedia) return;
    
    const youtubeLogoElement = document.getElementById('youtube-logo');
    const youtubeLinkElement = document.getElementById('youtube-link');
    const tiktokLogoElement = document.getElementById('tiktok-logo');
    const tiktokLinkElement = document.getElementById('tiktok-link');
    
    if (youtubeLogoElement && websiteData.socialMedia.youtube && websiteData.socialMedia.youtube.logo) {
        youtubeLogoElement.src = websiteData.socialMedia.youtube.logo;
        youtubeLogoElement.alt = 'YouTube Logo';
    }
    
    if (youtubeLinkElement && websiteData.socialMedia.youtube && websiteData.socialMedia.youtube.link) {
        youtubeLinkElement.href = websiteData.socialMedia.youtube.link;
    }
    
    if (tiktokLogoElement && websiteData.socialMedia.tiktok && websiteData.socialMedia.tiktok.logo) {
        tiktokLogoElement.src = websiteData.socialMedia.tiktok.logo;
        tiktokLogoElement.alt = 'TikTok Logo';
    }
    
    if (tiktokLinkElement && websiteData.socialMedia.tiktok && websiteData.socialMedia.tiktok.link) {
        tiktokLinkElement.href = websiteData.socialMedia.tiktok.link;
    }
}

// Load about page content
function loadAboutContent() {
    // DISABLED: Don't override the HTML content with Firebase content
    // if (!websiteData.about) return;
    
    // const titleElement = document.getElementById('about-title');
    // const contentElement = document.getElementById('about-content');
    
    // if (titleElement && websiteData.about.title) {
    //     titleElement.textContent = websiteData.about.title;
    // }
    
    // if (contentElement && websiteData.about.content) {
    //     contentElement.innerHTML = websiteData.about.content;
    // }
    
    // Load Emergency Hamburg data
    loadEmergencyHamburgContent();
    
    // Load Favourite Games data
    loadFavouriteGamesContent();
}

// Load Emergency Hamburg content
function loadEmergencyHamburgContent() {
    if (!websiteData.emergencyHamburg) {
        return;
    }
    
    const emergencyTitleElement = document.getElementById('emergency-title');
    const gamepassElement = document.getElementById('gamepass');
    const policeXpElement = document.getElementById('police-xp');
    const fireMedicalXpElement = document.getElementById('fire-medical-xp');
    const truckXpElement = document.getElementById('truck-xp');
    const adacXpElement = document.getElementById('adac-xp');
    const busDriverXpElement = document.getElementById('bus-driver-xp');
    
    if (emergencyTitleElement && websiteData.emergencyHamburg.title) {
        emergencyTitleElement.textContent = websiteData.emergencyHamburg.title;
    }
    
    if (gamepassElement && websiteData.emergencyHamburg.stats && websiteData.emergencyHamburg.stats.gamepass) {
        gamepassElement.textContent = websiteData.emergencyHamburg.stats.gamepass;
    }
    
    if (policeXpElement && websiteData.emergencyHamburg.stats && websiteData.emergencyHamburg.stats.policeXp) {
        policeXpElement.textContent = websiteData.emergencyHamburg.stats.policeXp;
    }
    
    if (fireMedicalXpElement && websiteData.emergencyHamburg.stats && websiteData.emergencyHamburg.stats.fireMedicalXp) {
        fireMedicalXpElement.textContent = websiteData.emergencyHamburg.stats.fireMedicalXp;
    }
    
    if (truckXpElement && websiteData.emergencyHamburg.stats && websiteData.emergencyHamburg.stats.truckXp) {
        truckXpElement.textContent = websiteData.emergencyHamburg.stats.truckXp;
    }
    
    if (adacXpElement && websiteData.emergencyHamburg.stats && websiteData.emergencyHamburg.stats.adacXp) {
        adacXpElement.textContent = websiteData.emergencyHamburg.stats.adacXp;
    }
    
    if (busDriverXpElement && websiteData.emergencyHamburg.stats && websiteData.emergencyHamburg.stats.busDriverXp) {
        busDriverXpElement.textContent = websiteData.emergencyHamburg.stats.busDriverXp;
    }
}

// Load Favourite Games content
function loadFavouriteGamesContent() {
    if (!websiteData.favouriteGames) {
        return;
    }
    
    const favouriteGamesTitleElement = document.getElementById('favourite-games-title');
    const game1Element = document.getElementById('game-1');
    const game2Element = document.getElementById('game-2');
    const game3Element = document.getElementById('game-3');
    
    if (favouriteGamesTitleElement && websiteData.favouriteGames.title) {
        favouriteGamesTitleElement.textContent = websiteData.favouriteGames.title;
    }
    
    if (game1Element && websiteData.favouriteGames.games && websiteData.favouriteGames.games[0]) {
        game1Element.textContent = websiteData.favouriteGames.games[0];
    }
    
    if (game2Element && websiteData.favouriteGames.games && websiteData.favouriteGames.games[1]) {
        game2Element.textContent = websiteData.favouriteGames.games[1];
    }
    
    if (game3Element && websiteData.favouriteGames.games && websiteData.favouriteGames.games[2]) {
        game3Element.textContent = websiteData.favouriteGames.games[2];
    }
}

// Load shop page content
function loadShopContent() {
    try {
        if (!websiteData.shop) {
            console.error('Shop data not found');
            return;
        }
        
        const titleElement = document.getElementById('shop-title');
        const subtitleElement = document.getElementById('shop-subtitle');
        const productsGrid = document.getElementById('products-grid');
        
        // Wait for elements to be available
        if (titleElement && websiteData.shop.title) {
            titleElement.textContent = websiteData.shop.title;
        }
        
        if (subtitleElement && websiteData.shop.subtitle) {
            subtitleElement.textContent = websiteData.shop.subtitle;
        }
        
        if (productsGrid) {
            // Add loading class to prevent layout shift
            productsGrid.classList.add('loading');
            
            // Clear content
            productsGrid.innerHTML = '';
            
            if (websiteData.shop.products && Array.isArray(websiteData.shop.products) && websiteData.shop.products.length > 0) {
                // Create all product cards first
                const fragment = document.createDocumentFragment();
                
                websiteData.shop.products.forEach((product, index) => {
                    try {
                        // Validate product data
                        if (product && typeof product === 'object') {
                            const productCard = createProductCard(product);
                            fragment.appendChild(productCard);
                        } else {
                            console.warn(`Invalid product data at index ${index}:`, product);
                        }
                    } catch (error) {
                        console.error(`Error creating product card at index ${index}:`, error);
                    }
                });
                
                // Add all cards at once to prevent layout shift
                productsGrid.appendChild(fragment);
            } else {
                productsGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No products available at the moment.</p>';
            }
            
            // Remove loading class
            productsGrid.classList.remove('loading');
        }
    } catch (error) {
        console.error('Error loading shop content:', error);
        playErrorSound();
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.classList.remove('loading');
            productsGrid.innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 2rem;">Error loading products. Please refresh the page.</p>';
        }
    }
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Safely escape HTML content
    const safeName = (product.name || 'Unnamed Product').replace(/"/g, '&quot;');
    const safeDescription = (product.description || 'No description available').replace(/"/g, '&quot;');
    const safeImage = product.image || 'https://via.placeholder.com/300x250/f8f9fa/666666?text=Image+Not+Found';
    const safePrice = product.price || 0;
    const safeBuyLink = (product.buyLink || '#').replace(/"/g, '&quot;');
    
    card.innerHTML = `
        <img src="${safeImage}" alt="${safeName}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250/f8f9fa/666666?text=Image+Not+Found'">
        <div class="product-info">
            <h3 style="margin-bottom: 0.5rem; color: #2c3e50; font-size: 1.2rem;">${safeName}</h3>
            <p class="product-description">${safeDescription}</p>
            <div class="product-actions">
                <button class="price-button">
                    <span class="robux-icon"></span>
                    ${safePrice}
                </button>
                <button class="buy-button" onclick="handleBuyClick('${safeBuyLink}')">
                    Buy
                </button>
            </div>
        </div>
    `;
    return card;
}

// Handle buy button click
function handleBuyClick(link) {
    if (link && link !== '#') {
        window.open(link, '_blank');
    } else {
        playSuccessSound();
        alert('Buy link not configured yet!');
    }
}

// Mobile menu toggle function
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.getElementById('mobile-menu');
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
});

// Theme functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Add click event listeners for both desktop and mobile toggles
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');
    
    // Set the theme attribute on the document
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update the desktop icon based on theme
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.src = 'White Toggle icon.png';
            themeIcon.alt = 'Switch to light theme';
        } else {
            themeIcon.src = 'Dark Toggle icon.png';
            themeIcon.alt = 'Switch to dark theme';
        }
    }
    
    // Update the mobile icon based on theme
    if (mobileThemeIcon) {
        if (theme === 'dark') {
            mobileThemeIcon.src = 'White Toggle icon.png';
            mobileThemeIcon.alt = 'Switch to light theme';
        } else {
            mobileThemeIcon.src = 'Dark Toggle icon.png';
            mobileThemeIcon.alt = 'Switch to dark theme';
        }
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Update theme color
    updateThemeColor();
}

// Load update page content
function loadUpdateContent() {
    if (!websiteData.updates) return;
    
    const updateTitleElement = document.getElementById('update-title');
    const updateDescriptionElement = document.getElementById('update-description');
    
    if (updateTitleElement && websiteData.updates.title) {
        updateTitleElement.textContent = websiteData.updates.title;
    }
    
    if (updateDescriptionElement && websiteData.updates.description) {
        // Clear existing content
        updateDescriptionElement.innerHTML = '';
        
        // Add each description item as a paragraph with bullet point
        websiteData.updates.description.forEach(item => {
            const p = document.createElement('p');
            p.textContent = item;
            updateDescriptionElement.appendChild(p);
        });
    }
}

// Animated greeting functionality
function initializeAnimatedGreeting() {
    const greetingElement = document.getElementById('animated-greeting');
    
    if (!greetingElement) return;
    
    const greetings = [
        'Talofa lava',  // Samoan
        'Hello',        // English
        'Malo',         // Tongan
        'Hi'            // English casual
    ];
    
    let currentIndex = 0;
    
    function changeGreeting() {
        // Add animation class
        greetingElement.classList.add('animating');
        
        // Change text after animation starts
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % greetings.length;
            greetingElement.textContent = greetings[currentIndex];
        }, 250); // Half of animation duration
        
        // Remove animation class after animation completes
        setTimeout(() => {
            greetingElement.classList.remove('animating');
        }, 500);
    }
    
    // Start the animation cycle
    setInterval(changeGreeting, 3000); // Change every 3 seconds
}

// Function to remove the website notice banner
// Call this function when your website is finished
function removeWebsiteNotice() {
    const noticeBanner = document.getElementById('website-notice');
    if (noticeBanner) {
        noticeBanner.style.display = 'none';
    }
}

// Uncomment the line below when your website is finished to remove the notice
// removeWebsiteNotice();

// Initialize navbar color on page load
function initializeNavbarColor() {
    const savedNavbarColor = localStorage.getItem('navbarColor') || 'black';
    document.documentElement.setAttribute('data-navbar-color', savedNavbarColor);
}

// Initialize glow color on page load
function initializeGlowColor() {
    const savedGlowColor = localStorage.getItem('glowColor') || 'blue';
    document.documentElement.setAttribute('data-glow-color', savedGlowColor);
    console.log('Glow color initialized:', savedGlowColor); // Debug log
}

// Apply notice banner setting on page load
function applyNoticeSetting() {
    const noticeEnabled = localStorage.getItem('noticeEnabled');
    const noticeBanner = document.getElementById('website-notice');
    
    if (noticeBanner) {
        if (noticeEnabled === 'false') {
            noticeBanner.classList.add('hidden');
        } else {
            noticeBanner.classList.remove('hidden');
        }
    }
}

// Apply glow color setting on page load
function applyGlowColorSetting() {
    const savedGlowColor = localStorage.getItem('glowColor') || 'blue';
    document.documentElement.setAttribute('data-glow-color', savedGlowColor);
    console.log('Glow color applied:', savedGlowColor);
}


// Confirm purchase dialog
function confirmPurchase(event) {
    event.preventDefault();
    
    // Show custom modal
    const modal = document.getElementById('purchase-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close purchase modal
function closePurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Go to Roblox
function goToRoblox() {
    window.open('https://www.roblox.com', '_blank');
    closePurchaseModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('purchase-modal');
    if (event.target === modal) {
        closePurchaseModal();
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    
    // Initialize desktop search
    if (searchInput && searchBtn && searchResults) {
        initializeSearchBar(searchInput, searchBtn, searchResults);
    }
}

function initializeSearchBar(searchInput, searchBtn, searchResults) {
    
    let searchTimeout;
    
    // Search data structure
    const searchData = [
        {
            title: "Home",
            description: "Welcome to Masg685's website. Learn about Emergency Hamburg, view updates, and connect with the community.",
            page: "index.html",
            elementId: "hero-section",
            keywords: ["home", "welcome", "masg685", "main", "landing"]
        },
        {
            title: "About Me",
            description: "Learn about Masg685, Emergency Hamburg player with over 300,000 XP as police officer. Born in Samoa, now in Australia.",
            page: "about.html",
            elementId: "about-title",
            keywords: ["about", "masg685", "emergency hamburg", "police", "samoa", "australia", "xp", "stats", "qa", "questions"]
        },
        {
            title: "Shop",
            description: "Browse and purchase Roblox clothing items and accessories. Currently under development.",
            page: "shop.html",
            elementId: "shop-title",
            keywords: ["shop", "store", "roblox", "clothing", "items", "buy", "purchase", "robux"]
        },
        {
            title: "Settings",
            description: "Customize your website experience with theme settings, navbar colors, and notification preferences.",
            page: "settings.html",
            elementId: "settings-title",
            keywords: ["settings", "preferences", "theme", "dark mode", "light mode", "navbar", "color", "notifications"]
        },
        {
            title: "Updates",
            description: "Latest website updates and version history. Track new features and improvements.",
            page: "update.html",
            elementId: "update-title",
            keywords: ["updates", "version", "changelog", "news", "features", "improvements", "v3.1.0"]
        },
        {
            title: "Emergency Hamburg",
            description: "German roleplay game where Masg685 has earned over 300,000 XP as police officer. Features multiple job roles and teams.",
            page: "about.html",
            elementId: "emergency-title",
            keywords: ["emergency hamburg", "german", "roleplay", "police", "fire", "medical", "adac", "bus driver", "truck driver", "controller"]
        },
        {
            title: "Social Media",
            description: "Connect with Masg685 on TikTok and Roblox. Follow for Emergency Hamburg content and updates.",
            page: "index.html",
            elementId: "social-media",
            keywords: ["social media", "tiktok", "roblox", "follow", "connect", "content", "videos"]
        },
        {
            title: "Rating System",
            description: "Rate the website and leave comments. Share your feedback with the community.",
            page: "index.html",
            elementId: "rating-comments-section",
            keywords: ["rating", "stars", "comments", "feedback", "review", "rate"]
        },
        {
            title: "Q&A Section",
            description: "Frequently asked questions about Masg685, Emergency Hamburg, and gaming experiences.",
            page: "about.html",
            elementId: "qa-section",
            keywords: ["qa", "questions", "answers", "faq", "frequently asked", "gaming", "roblox", "emergency hamburg"]
        },
        {
            title: "Theme Toggle",
            description: "Switch between light and dark themes for better viewing experience.",
            page: "settings.html",
            elementId: "theme-selector",
            keywords: ["theme", "dark mode", "light mode", "toggle", "appearance", "color scheme"]
        },
        {
            title: "Police XP Stats",
            description: "View Masg685's impressive police XP statistics in Emergency Hamburg.",
            page: "about.html",
            elementId: "police-xp",
            keywords: ["police xp", "police stats", "312213", "300000", "police officer"]
        },
        {
            title: "Fire & Medical XP",
            description: "Check out fire and medical team experience points.",
            page: "about.html",
            elementId: "fire-medical-xp",
            keywords: ["fire xp", "medical xp", "fire medical", "20352", "fire team", "medical team"]
        },
        {
            title: "Comments Section",
            description: "Read and leave comments about the website.",
            page: "index.html",
            elementId: "rating-comments-section",
            keywords: ["comments", "comment", "feedback", "reviews", "discussion"]
        }
    ];
    
    // Search function
    function performSearch(query) {
        if (!query || query.trim().length < 2) {
            searchResults.classList.remove('show');
            return;
        }
        
        const searchTerm = query.toLowerCase().trim();
        const results = searchData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTerm);
            const descMatch = item.description.toLowerCase().includes(searchTerm);
            const keywordMatch = item.keywords.some(keyword => keyword.includes(searchTerm));
            return titleMatch || descMatch || keywordMatch;
        });
        
        displaySearchResults(results, searchTerm);
    }
    
    // Display search results
    function displaySearchResults(results, searchTerm) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found for "' + searchTerm + '"</div>';
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-title">${highlightSearchTerm(result.title, searchTerm)}</div>
                    <div class="search-result-description">${highlightSearchTerm(result.description, searchTerm)}</div>
                `;
                
                resultItem.addEventListener('click', () => {
                    const currentPage = window.location.pathname.split('/').pop();
                    const searchTerm = searchInput.value.trim();
                    
                    if (result.page !== currentPage) {
                        // Navigate to different page
                        window.location.href = result.page;
                    } else {
                        // Same page - scroll to element with search term highlighting
                        scrollToElement(result.elementId, searchTerm);
                    }
                    
                    searchResults.classList.remove('show');
                    searchInput.value = '';
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.classList.add('show');
    }
    
    // Highlight search terms in results
    function highlightSearchTerm(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark style="background: rgba(255, 215, 0, 0.3); padding: 0.1rem 0.2rem; border-radius: 3px;">$1</mark>');
    }
    
    // Event listeners
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
    
    searchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(searchInput.value);
        } else if (e.key === 'Escape') {
            searchResults.classList.remove('show');
            searchInput.blur();
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('show');
        }
    });
    
    // Handle keyboard navigation in search results
    let selectedIndex = -1;
    searchInput.addEventListener('keydown', (e) => {
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, resultItems.length - 1);
            updateSelection(resultItems, selectedIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection(resultItems, selectedIndex);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            resultItems[selectedIndex].click();
        }
    });
    
    function updateSelection(items, index) {
        items.forEach((item, i) => {
            item.style.backgroundColor = i === index ? 'var(--navbar-color-rgba)' : '';
        });
    }
}

// Function to scroll to a specific element and highlight search terms
function scrollToElement(elementId, searchTerm = '') {
    if (!elementId) return;
    
    const element = document.getElementById(elementId);
    if (element) {
        // Highlight search terms in the element's text content
        if (searchTerm && searchTerm.trim().length > 1) {
            highlightSearchTermsInElement(element, searchTerm);
        }
        
        // Add a temporary highlight effect to the element
        element.style.transition = 'background-color 0.3s ease';
        element.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
        
        // Scroll to element with offset for navbar
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const elementPosition = element.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            element.style.backgroundColor = '';
            // Remove text highlighting
            removeTextHighlighting(element);
        }, 3000);
    }
}

// Function to highlight search terms in element text
function highlightSearchTermsInElement(element, searchTerm) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
}

// Function to remove text highlighting
function removeTextHighlighting(element) {
    const highlights = element.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}
