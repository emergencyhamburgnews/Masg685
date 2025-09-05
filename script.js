// Global variable to store website data
let websiteData = {};

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        loadWebsiteData();
        initializeTheme();
        loadUpdateContent();
        initializeAnimatedGreeting();
    }, 100);
});

// Load data from data.json file
async function loadWebsiteData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        const jsonData = await response.json();
        websiteData = jsonData;
        loadPageContent();
    } catch (error) {
        console.error('Error loading website data:', error);
        // Try to load from localStorage first
        const savedData = localStorage.getItem('websiteData');
        if (savedData) {
            try {
                websiteData = JSON.parse(savedData);
                loadPageContent();
                return;
            } catch (e) {
                console.error('Error parsing saved data:', e);
            }
        }
        // Use the data from data-loader.js if available
        if (typeof window.websiteData !== 'undefined') {
            websiteData = window.websiteData;
            loadPageContent();
            return;
        }
        // Fallback to default data if JSON file is not found
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
            loadShopContent();
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
    if (!websiteData.about) return;
    
    const titleElement = document.getElementById('about-title');
    const contentElement = document.getElementById('about-content');
    
    if (titleElement && websiteData.about.title) {
        titleElement.textContent = websiteData.about.title;
    }
    
    if (contentElement && websiteData.about.content) {
        contentElement.textContent = websiteData.about.content;
    }
    
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