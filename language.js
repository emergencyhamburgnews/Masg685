// Translation dictionary
const translations = {
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-contact': 'Contact',
        'nav-updates': 'Updates',
        'nav-private-server': 'Private Server',
        'nav-settings': 'Settings',
        'nav-tiktok': 'TikTok Downloader',
        'nav-report': 'Report Player',
        'nav-unban': 'Unban Request',
        
        // Common elements
        'submit': 'Submit',
        'cancel': 'Cancel',
        'save': 'Save',
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success',
        
        // Form labels
        'username': 'Username',
        'email': 'Email',
        'message': 'Message',
        'reason': 'Reason',
        'description': 'Description',
        
        // Settings page
        'settings-title': 'Settings',
        'settings-subtitle': 'Customize your website experience',
        'dark-mode': 'Dark Mode',
        'enable-dark-mode': 'Enable dark mode',
        'dark-mode-desc': 'Switch between light and dark appearance.',
        'font-size': 'Font Size',
        'adjust-font-size': 'Adjust font size',
        'font-size-desc': 'Change the base font size for better readability.',
        'language': 'Language',
        'language-desc': 'Select your preferred language.',
        'card-style': 'Card Style',
        'enable-card-style': 'Enable card style',
        'card-style-desc': 'Switch between flat and card UI. (Feature coming soon)',
        'animations': 'Animations',
        'enable-animations': 'Enable animations',
        'animations-desc': 'Toggle UI animations for a smoother experience. (Feature coming soon)',
        'preview-nav': 'Preview & Navigation',
        
        // Preview links
        'preview-home': 'Home',
        'preview-about': 'About',
        'preview-contact': 'Contact',
        'preview-updates': 'Updates',
        'preview-private-server': 'Private Server',
        'preview-tiktok': 'TikTok Downloader',
        'preview-report': 'Report Player',
        'preview-unban': 'Unban Request',

        // Home page
        'home-title': 'Hi :)',
        'home-description': 'Emergency Hamburg player',
        'home-subtitle': 'welcome to my personal site, you can find information about me here',
        'get-started': 'Get Started',
        'learn-more': 'Learn More',

        // About page
        'about-title': 'About Me',
        'about-subtitle': 'Learn More About Emergency Hamburg',
        'about-description': "Hi, my nickname is Masg685 and I'm from Australia. I was born on the island of Savai'i in Samoa. In 2023, I started playing Emergency Hamburg, a roleplay game from Germany. I've earned over 300,000 XP as a police officer, which is known as one of the best teams in the game.",
        'our-mission': 'Our Mission',
        'our-vision': 'Our Vision',
        'our-values': 'Our Values',

        // Contact page
        'contact-title': 'Contact Us',
        'contact-subtitle': 'Get in Touch',
        'contact-description': 'Have questions or feedback? We\'d love to hear from you.',
        'name': 'Name',
        'subject': 'Subject',
        'your-message': 'Your Message',
        'send-message': 'Send Message',

        // Update page
        'updates-title': 'Latest Updates',
        'updates-subtitle': 'Stay Informed',
        'updates-description': 'Check out our latest news and updates.',
        'read-more': 'Read More',

        // Private Server page
        'private-server-title': 'Private Server',
        'private-server-subtitle': 'Create Your Own Server',
        'private-server-description': 'Set up your own private server and customize your experience.',
        'server-name': 'Server Name',
        'server-password': 'Server Password',
        'create-server': 'Create Server',

        // TikTok Downloader page
        'tiktok-title': 'TikTok Downloader',
        'tiktok-subtitle': 'Download TikTok Videos',
        'tiktok-description': 'Enter a TikTok video URL to download.',
        'video-url': 'Video URL',
        'download': 'Download',

        // Report Player page
        'report-title': 'Report Player',
        'report-subtitle': 'Report Misconduct',
        'report-description': 'Help us maintain a safe and enjoyable environment.',
        'player-name': 'Player Name',
        'report-reason': 'Reason for Report',
        'submit-report': 'Submit Report',

        // Unban Request page
        'unban-title': 'Unban Request',
        'unban-subtitle': 'Request Account Unban',
        'unban-description': 'Submit a request to have your account unbanned.',
        'ban-reason': 'Reason for Ban',
        'appeal-message': 'Appeal Message',
        'submit-appeal': 'Submit Appeal'
    },
    sm: {
        // Navigation
        'nav-home': 'Aiga',
        'nav-about': 'E Uiga',
        'nav-contact': 'Fa\'afeso\'ota\'i',
        'nav-updates': 'Fa\'afouga',
        'nav-private-server': 'Server Tumaoti',
        'nav-settings': 'Tulaga',
        'nav-tiktok': 'TikTok Downloader',
        'nav-report': 'Lipoti Tagata Ta\'alo',
        'nav-unban': 'Talosaga Unban',
        
        // Common elements
        'submit': 'Lafo',
        'cancel': 'Fa\'aleaogaina',
        'save': 'Fa\'asaoina',
        'loading': 'O lo\'o utaina...',
        'error': 'Sese',
        'success': 'Manuia',
        
        // Form labels
        'username': 'Igoa',
        'email': 'Imeli',
        'message': 'Fe\'au',
        'reason': 'Mafua\'aga',
        'description': 'Fa\'amatalaga',
        
        // Settings page
        'settings-title': 'Tulaga',
        'settings-subtitle': 'Fa\'apitoa lou poto masani i luga o le upega tafa\'ilagi',
        'dark-mode': 'Pogisa',
        'enable-dark-mode': 'Fa\'aola le pogisa',
        'dark-mode-desc': 'Suia i le va o le malamalama ma le pogisa.',
        'font-size': 'Tele o le Mataitusi',
        'adjust-font-size': 'Fetuuna\'i le tele o mataitusi',
        'font-size-desc': 'Suia le tele o mataitusi mo le faitau lelei.',
        'language': 'Gagana',
        'language-desc': 'Filifili lou gagana e fiafia i ai.',
        'card-style': 'Faiga Kata',
        'enable-card-style': 'Fa\'aola le faiga kata',
        'card-style-desc': 'Suia i le va o le UI mafolafola ma kata. (O le a oʻo mai le vaega)',
        'animations': 'Fa\'afiafiaga',
        'enable-animations': 'Fa\'aola fa\'afiafiaga',
        'animations-desc': 'Suia fa\'afiafiaga UI mo se poto masani sili atu. (O le a oʻo mai le vaega)',
        'preview-nav': 'Va\'ai & Fa\'atautaiga',
        
        // Preview links
        'preview-home': 'Aiga',
        'preview-about': 'E Uiga',
        'preview-contact': 'Fa\'afeso\'ota\'i',
        'preview-updates': 'Fa\'afouga',
        'preview-private-server': 'Server Tumaoti',
        'preview-tiktok': 'TikTok Downloader',
        'preview-report': 'Lipoti Tagata Ta\'alo',
        'preview-unban': 'Talosaga Unban',

        // Home page
        'home-title': 'Talofa :)',
        'home-description': 'Tagata taalo Emergency Hamburg',
        'home-subtitle': 'Afio mai i la\'u upega tafa\'ilagi patino, e mafai ona e maua ai faamatalaga e uiga ia te a\'u iinei',
        'get-started': 'Amata',
        'learn-more': 'A\'oa\'o atili',

        // About page
        'about-title': 'E Uiga ia te aʻu',
        'about-subtitle': 'A\'oa\'o atili e uiga i Emergency Hamburg',
        'about-description': "O lo'u igoa o Masg685, ou te sau mai Ausetalia ae na ou fanau i le motu o Savai'i i Samoa. I le 2023, na amata ai ona ou ta'a'alo i le Emergency Hamburg, o se ta'aloga fa'ata'ita'i mai Siamani. Ua ou maua le silia ma le 300,000 XP i le avea ai ma leoleo, o se tasi o 'au sili ona lelei i le ta'aloga.",
        'our-mission': 'La Matou Misiona',
        'our-vision': 'La Matou Va\'ai',
        'our-values': 'O Matou Tulaga Taua',

        // Contact page
        'contact-title': 'Fa\'afeso\'ota\'i i Matou',
        'contact-subtitle': 'Fa\'afeso\'ota\'i',
        'contact-description': 'E iai ni fesili po\'o ni manatu? Matou te fiafia e fa\'alogo mai ia te oe.',
        'name': 'Igoa',
        'subject': 'Mataupu',
        'your-message': 'Lau Fe\'au',
        'send-message': 'Lafo Fe\'au',

        // Update page
        'updates-title': 'Fa\'afouga Fou',
        'updates-subtitle': 'Tumau i le Malamalama',
        'updates-description': 'Siaki a matou tala fou ma fa\'afouga.',
        'read-more': 'Faitau atili',

        // Private Server page
        'private-server-title': 'Server Tumaoti',
        'private-server-subtitle': 'Fausia Lou Server',
        'private-server-description': 'Fa\'atulaga lou server tumaoti ma fa\'apitoa lou poto masani.',
        'server-name': 'Igoa Server',
        'server-password': 'Upu Fa\'ataga Server',
        'create-server': 'Fausia Server',

        // TikTok Downloader page
        'tiktok-title': 'TikTok Downloader',
        'tiktok-subtitle': 'Lalotoso Vitio TikTok',
        'tiktok-description': 'Ulufale se URL vitio TikTok e lalotoso.',
        'video-url': 'URL Vitio',
        'download': 'Lalotoso',

        // Report Player page
        'report-title': 'Lipoti Tagata Ta\'alo',
        'report-subtitle': 'Lipoti Amioga Le Taupulea',
        'report-description': 'Fesoasoani ia i matou e tausia se si\'osi\'omaga saogalemu ma fiafia.',
        'player-name': 'Igoa Tagata Ta\'alo',
        'report-reason': 'Mafua\'aga o le Lipoti',
        'submit-report': 'Lafo Lipoti',

        // Unban Request page
        'unban-title': 'Talosaga Unban',
        'unban-subtitle': 'Talosaga e Aveese le Fa\'asaina o le Account',
        'unban-description': 'Lafo se talosaga e aveese ai le fa\'asaina o lou account.',
        'ban-reason': 'Mafua\'aga o le Fa\'asaina',
        'appeal-message': 'Fe\'au Talosaga',
        'submit-appeal': 'Lafo Talosaga'
    }
};

// Function to update language across all pages
function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    localStorage.setItem('userLanguage', lang);
    
    // Update page title if it has a data-translate-title attribute
    const titleElement = document.querySelector('[data-translate-title]');
    if (titleElement) {
        const titleKey = titleElement.getAttribute('data-translate-title');
        if (translations[lang][titleKey]) {
            document.title = translations[lang][titleKey] + ' - Emergency Hamburg';
        }
    }
}

// Function to initialize language on page load
function initLanguage() {
    const savedLanguage = localStorage.getItem('userLanguage') || 'en';
    updateLanguage(savedLanguage);
    
    // If we're on the settings page, update the language selector
    const languageSelect = document.getElementById('language-setting');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        languageSelect.addEventListener('change', function() {
            updateLanguage(this.value);
        });
    }
}

// Initialize language when the DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguage); 