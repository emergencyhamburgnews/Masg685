// Initialize settings
function initSettings() {
    // Font size functionality
    const fontSizeSetting = document.getElementById('font-size-setting');
    if (fontSizeSetting) {
        const savedFontSize = localStorage.getItem('fontSize') || '16';
        fontSizeSetting.value = savedFontSize;
        document.documentElement.style.fontSize = savedFontSize + 'px';
        
        fontSizeSetting.addEventListener('change', function() {
            const newSize = this.value;
            document.documentElement.style.fontSize = newSize + 'px';
            localStorage.setItem('fontSize', newSize);
        });
    }

    // Language functionality
    const languageSetting = document.getElementById('language-setting');
    if (languageSetting) {
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSetting.value = savedLanguage;
        
        languageSetting.addEventListener('change', function() {
            const newLanguage = this.value;
            localStorage.setItem('language', newLanguage);
            updateLanguage(newLanguage);
        });
    }

    // Theme functionality
    const themeToggle = document.getElementById('theme-toggle-setting');
    if (themeToggle) {
        // Set initial state based on saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        themeToggle.checked = savedTheme === 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Add change event listener
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Initialize settings when the page loads
document.addEventListener('DOMContentLoaded', initSettings); 