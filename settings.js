// Settings functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    // Ensure theme is properly initialized on settings page
    if (typeof initializeThemeOnAllPages === 'function') {
        initializeThemeOnAllPages();
    }
});

// Initialize settings page
function initializeSettings() {
    loadSettings();
    setupEventListeners();
    updateThemeSelector();
    updateNavbarColorSelector();
    updateGlowColorSelector();
    updateGradientSelector();
    
    // Force mobile status bar to update on page load
    setTimeout(() => {
        forceMobileStatusBarUpdate();
    }, 1000);
}

// Load saved settings from localStorage
function loadSettings() {
    // Load notice banner setting
    const noticeEnabled = localStorage.getItem('noticeEnabled');
    const noticeToggle = document.getElementById('notice-toggle');
    const noticeStatus = document.getElementById('notice-status');
    
    if (noticeEnabled === 'false') {
        noticeToggle.checked = false;
        noticeStatus.textContent = 'Disabled';
        hideNoticeBanner();
    } else {
        noticeToggle.checked = true;
        noticeStatus.textContent = 'Enabled';
        showNoticeBanner();
    }
    
    // Load theme setting
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeSelector = document.getElementById('theme-selector');
    themeSelector.value = savedTheme;
    
    // Load navbar color setting
    const savedNavbarColor = localStorage.getItem('navbarColor') || 'black';
    const navbarColorSelector = document.getElementById('navbar-color-selector');
    navbarColorSelector.value = savedNavbarColor;
    
    // Load glow color setting
    const savedGlowColor = localStorage.getItem('glowColor') || 'blue';
    const glowColorSelector = document.getElementById('glow-color-selector');
    glowColorSelector.value = savedGlowColor;
    
    // Load gradient setting
    const savedGradient = localStorage.getItem('navbarGradient') || 'none';
    updateGradientSelection(savedGradient);
}

// Setup event listeners for settings controls
function setupEventListeners() {
    // Notice toggle
    const noticeToggle = document.getElementById('notice-toggle');
    const noticeStatus = document.getElementById('notice-status');
    
    noticeToggle.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('noticeEnabled', 'true');
            noticeStatus.textContent = 'Enabled';
            showNoticeBanner();
        } else {
            localStorage.setItem('noticeEnabled', 'false');
            noticeStatus.textContent = 'Disabled';
            hideNoticeBanner();
        }
    });
    
    // Theme selector
    const themeSelector = document.getElementById('theme-selector');
    themeSelector.addEventListener('change', function() {
        const selectedTheme = this.value;
        
        if (selectedTheme === 'auto') {
            // Use system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            setTheme(systemTheme);
            localStorage.setItem('theme', 'auto');
        } else {
            setTheme(selectedTheme);
            localStorage.setItem('theme', selectedTheme);
        }
    });
    
    // Navbar color selector
    const navbarColorSelector = document.getElementById('navbar-color-selector');
    navbarColorSelector.addEventListener('change', function() {
        const selectedColor = this.value;
        setNavbarColor(selectedColor);
        localStorage.setItem('navbarColor', selectedColor);
        
        // Update theme color immediately and force mobile status bar update
        if (typeof updateThemeColor === 'function') {
            updateThemeColor();
        }
        
        // Force mobile status bar to update by refreshing meta tags
        forceMobileStatusBarUpdate();
    });
    
    // Glow color selector
    const glowColorSelector = document.getElementById('glow-color-selector');
    glowColorSelector.addEventListener('change', function() {
        const selectedColor = this.value;
        setGlowColor(selectedColor);
        localStorage.setItem('glowColor', selectedColor);
    });
    
    // Gradient options
    const gradientOptions = document.querySelectorAll('.gradient-option');
    gradientOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedGradient = this.getAttribute('data-gradient');
            setNavbarGradient(selectedGradient);
            localStorage.setItem('navbarGradient', selectedGradient);
            updateGradientSelection(selectedGradient);
            
            // Force mobile status bar to update
            forceMobileStatusBarUpdate();
        });
    });
    
    // Reset settings button
    const resetButton = document.getElementById('reset-settings');
    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            resetAllSettings();
        }
    });
    
    // Listen for system theme changes when auto is selected
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') {
            const systemTheme = this.matches ? 'dark' : 'light';
            setTheme(systemTheme);
        }
    });
}

// Show notice banner
function showNoticeBanner() {
    const noticeBanner = document.getElementById('website-notice');
    if (noticeBanner) {
        noticeBanner.classList.remove('hidden');
    }
}

// Hide notice banner
function hideNoticeBanner() {
    const noticeBanner = document.getElementById('website-notice');
    if (noticeBanner) {
        noticeBanner.classList.add('hidden');
    }
}

// Update theme selector to reflect current theme
function updateThemeSelector() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const themeSelector = document.getElementById('theme-selector');
    
    if (themeSelector) {
        themeSelector.value = currentTheme;
    }
}

// Set navbar color
function setNavbarColor(color) {
    document.documentElement.setAttribute('data-navbar-color', color);
}

// Set glow color
function setGlowColor(color) {
    document.documentElement.setAttribute('data-glow-color', color);
}

// Update navbar color selector to reflect current color
function updateNavbarColorSelector() {
    const currentColor = localStorage.getItem('navbarColor') || 'black';
    const navbarColorSelector = document.getElementById('navbar-color-selector');
    
    if (navbarColorSelector) {
        navbarColorSelector.value = currentColor;
    }
}

// Update glow color selector to reflect current color
function updateGlowColorSelector() {
    const currentColor = localStorage.getItem('glowColor') || 'blue';
    const glowColorSelector = document.getElementById('glow-color-selector');
    
    if (glowColorSelector) {
        glowColorSelector.value = currentColor;
    }
}

// Reset all settings to default values
function resetAllSettings() {
    // Reset notice banner
    localStorage.setItem('noticeEnabled', 'true');
    const noticeToggle = document.getElementById('notice-toggle');
    const noticeStatus = document.getElementById('notice-status');
    noticeToggle.checked = true;
    noticeStatus.textContent = 'Enabled';
    showNoticeBanner();
    
    // Reset theme
    localStorage.setItem('theme', 'light');
    const themeSelector = document.getElementById('theme-selector');
    themeSelector.value = 'light';
    setTheme('light');
    
    // Reset navbar color
    localStorage.setItem('navbarColor', 'black');
    const navbarColorSelector = document.getElementById('navbar-color-selector');
    navbarColorSelector.value = 'black';
    setNavbarColor('black');
    
    // Reset glow color
    localStorage.setItem('glowColor', 'blue');
    const glowColorSelector = document.getElementById('glow-color-selector');
    glowColorSelector.value = 'blue';
    setGlowColor('blue');
    
    // Reset gradient
    localStorage.setItem('navbarGradient', 'none');
    setNavbarGradient('none');
    updateGradientSelection('none');
    
    // Show confirmation
    playSuccessSound();
    alert('All settings have been reset to their default values!');
}

// Apply notice banner setting on page load (for other pages)
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

// Call this function on all pages to apply notice setting
applyNoticeSetting();

// Apply glow color setting on all pages
function applyGlowColorSetting() {
    const savedGlowColor = localStorage.getItem('glowColor') || 'blue';
    document.documentElement.setAttribute('data-glow-color', savedGlowColor);
    console.log('Glow color applied:', savedGlowColor);
}

// Call this function on all pages to apply glow color setting
applyGlowColorSetting();

// Set navbar gradient
function setNavbarGradient(gradient) {
    document.documentElement.setAttribute('data-navbar-gradient', gradient);
    console.log('Gradient set to:', gradient);
    
    // Force a re-render by temporarily removing and re-adding the attribute
    if (gradient !== 'none') {
        document.documentElement.removeAttribute('data-navbar-gradient');
        setTimeout(() => {
            document.documentElement.setAttribute('data-navbar-gradient', gradient);
        }, 10);
    }
    
    // Update mobile status bar color to match gradient
    if (typeof updateThemeColor === 'function') {
        updateThemeColor();
    }
    
    // Force mobile status bar update with multiple attempts
    setTimeout(() => {
        forceMobileStatusBarUpdate();
    }, 100);
    
    setTimeout(() => {
        forceMobileStatusBarUpdate();
    }, 500);
}

// Update gradient selection visual state
function updateGradientSelection(selectedGradient) {
    const gradientOptions = document.querySelectorAll('.gradient-option');
    gradientOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.getAttribute('data-gradient') === selectedGradient) {
            option.classList.add('selected');
        }
    });
}

// Update gradient selector to reflect current gradient
function updateGradientSelector() {
    const currentGradient = localStorage.getItem('navbarGradient') || 'none';
    updateGradientSelection(currentGradient);
}

// Apply gradient setting on all pages
function applyGradientSetting() {
    const savedGradient = localStorage.getItem('navbarGradient') || 'none';
    document.documentElement.setAttribute('data-navbar-gradient', savedGradient);
    console.log('Gradient applied:', savedGradient);
}

// Call this function on all pages to apply gradient setting
applyGradientSetting();

// Force mobile status bar to update by refreshing meta tags
function forceMobileStatusBarUpdate() {
    const navbarColor = localStorage.getItem('navbarColor') || 'black';
    const navbarGradient = localStorage.getItem('navbarGradient') || 'none';
    
    let themeColor;
    
    // Check if gradient is active first
    if (navbarGradient !== 'none') {
        // Use representative colors from gradients for mobile status bar
        switch (navbarGradient) {
            case 'sunset': themeColor = '#ffa726'; break;  // Middle color of sunset gradient (orange)
            case 'ocean': themeColor = '#00bcd4'; break;   // Middle color of ocean gradient (cyan)
            case 'forest': themeColor = '#8bc34a'; break;  // Middle color of forest gradient (light green)
            default: themeColor = '#000000'; break;
        }
    } else {
        // Use solid navbar colors
        switch (navbarColor) {
            case 'red': themeColor = '#dc3545'; break;
            case 'blue': themeColor = '#007bff'; break;
            case 'green': themeColor = '#28a745'; break;
            case 'purple': themeColor = '#6f42c1'; break;
            case 'orange': themeColor = '#fd7e14'; break;
            case 'pink': themeColor = '#6c757d'; break;
            case 'cyan': themeColor = '#17a2b8'; break;
            case 'yellow': themeColor = '#ffc107'; break;
            default: themeColor = '#000000';
        }
    }
    
    // Force update all mobile status bar meta tags
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', themeColor);
    }
    
    const msNavButtonMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
    if (msNavButtonMeta) {
        msNavButtonMeta.setAttribute('content', themeColor);
    }
    
    const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleStatusBarMeta) {
        const isLightColor = themeColor === '#ffa726' || themeColor === '#8bc34a' || themeColor === '#00bcd4' || themeColor === '#f39c12' || themeColor === '#ffc107';
        appleStatusBarMeta.setAttribute('content', isLightColor ? 'black-translucent' : 'white-translucent');
    }
    
    // Force mobile browsers to recognize the change
    if (window.navigator && window.navigator.standalone !== undefined) {
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }
    
    console.log('Mobile status bar forced to update to:', themeColor);
}
