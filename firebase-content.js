// Firebase Content Management System
class FirebaseContentManager {
    constructor() {
        this.content = {};
        this.init();
    }

    async init() {
        // Wait for Firebase to be available
        if (!window.firebaseApp) {
            console.log('Waiting for Firebase to load...');
            setTimeout(() => this.init(), 100);
            return;
        }

        console.log('Firebase Content Manager initialized');
        await this.loadContent();
    }

    async loadContent() {
        try {
            const { db, collection, getDocs, doc, getDoc } = window.firebaseApp;
            
            // Load website content
            const contentDoc = await getDoc(doc(db, 'website', 'content'));
            if (contentDoc.exists()) {
                this.content = contentDoc.data();
                console.log('Website content loaded from Firebase');
            } else {
                // Create default content if it doesn't exist
                await this.createDefaultContent();
            }

            // Load notice content
            const noticeDoc = await getDoc(doc(db, 'website', 'notice'));
            if (noticeDoc.exists()) {
                this.content.notice = noticeDoc.data();
                console.log('Notice content loaded from Firebase:', this.content.notice);
            } else {
                // Create default notice
                await this.createDefaultNotice();
            }

            // Apply content to website
            this.applyContent();
            
            // Set up real-time listeners for content updates
            this.setupRealtimeListeners();
            
        } catch (error) {
            console.error('Error loading content from Firebase:', error);
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
            // Fallback to default content
            this.loadDefaultContent();
        }
    }

    async createDefaultContent() {
        try {
            const { db, doc, setDoc } = window.firebaseApp;
            
            const defaultContent = {
                home: {
                    title: "Masg685 - Home",
                    description: "Join my RP private server in Emergency Hamburg. Experience the best roleplay with over 300,000 XP as police officer!",
                    image: "img4.jpg",
                    video: null,
                    mediaType: "image" // "image" or "video"
                },
                about: {
                    title: "About Me",
                    content: "Hi, My gaming name is Masg685 and I'm from Australia, I was born on the island of Savai'i in Samoa.<br><br>In 2023, I started playing Emergency Hamburg, a roleplay game from Germany. I've earned over 300,000 XP as police officer, which is known as one of the best teams in the game.<br><br>Later, I started creating content on social Media beginning with Youtube and then expanding to TikTok. if you haven't subscribed yet, please do it really helps me out."
                },
                emergencyHamburg: {
                    title: "Emergency Hamburg",
                    stats: {
                        gamepass: "+9",
                        policeXp: "+340,610XP Total",
                        fireMedicalXp: "+21,270XP Total",
                        truckXp: "+1,721XP Total",
                        adacXp: "+2,341XP Total",
                        busDriverXp: "+1,454XP Total"
                    }
                },
                favouriteGames: {
                    title: "My Favourite Games",
                    games: [
                        "Emergency Hamburg",
                        "Rugby Rumble",
                        "Grow A Garden"
                    ]
                },
                shop: {
                    title: "Shop",
                    subtitle: "This page isn't ready yet, but it will be soon. Stay tuned!",
                    products: [
                        {
                            id: 1,
                            name: "N/A",
                            description: "N/A",
                            image: "https://via.placeholder.com/300x250/4a90e2/ffffff?text=Blue+Shirt",
                            price: 0,
                            buyLink: "#"
                        },
                        {
                            id: 2,
                            name: "N/A",
                            description: "N/A",
                            image: "https://via.placeholder.com/300x250/2c3e50/ffffff?text=Black+Pants",
                            price: 0,
                            buyLink: "#"
                        },
                        {
                            id: 3,
                            name: "N/A",
                            description: "N/A",
                            image: "https://via.placeholder.com/300x250/e74c3c/ffffff?text=Red+Hoodie",
                            price: 0,
                            buyLink: "#"
                        }
                    ]
                },
                socialMedia: {
                    title: "Social Media",
                    youtube: {
                        logo: "robloxlogo.png",
                        link: "https://www.roblox.com/users/5255024681/profile"
                    },
                    tiktok: {
                        logo: "tiktok-logo.png",
                        link: "https://www.tiktok.com/@masg685"
                    }
                },
                updates: {
                    title: "Website Update V3.0.5",
                    description: [
                        "🔧 FIXED: Rating system now works properly - fixed multiple rating issues",
                        "🔧 FIXED: Comment system now functions correctly with Firebase integration",
                        "🔧 FIXED: Rating and comment reset functionality working properly"
                    ]
                }
            };

            await setDoc(doc(db, 'website', 'content'), defaultContent);
            this.content = defaultContent;
            console.log('Default content created in Firebase');
        } catch (error) {
            console.error('Error creating default content:', error);
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
        }
    }

    async createDefaultNotice() {
        try {
            const { db, doc, setDoc } = window.firebaseApp;
            
            const defaultNotice = {
                enabled: true,
                text: "Loading...",
                icon: "⚠️"
            };

            await setDoc(doc(db, 'website', 'notice'), defaultNotice);
            this.content.notice = defaultNotice;
            console.log('Default notice created in Firebase');
        } catch (error) {
            console.error('Error creating default notice:', error);
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
        }
    }

    loadDefaultContent() {
        // Fallback content if Firebase fails
        this.content = {
            home: {
                title: "Masg685 - Home",
                description: "Join my RP private server in Emergency Hamburg. Experience the best roleplay with over 300,000 XP as police officer!",
                image: "img4.jpg",
                video: null,
                mediaType: "image"
            },
            notice: {
                enabled: true,
                text: "Loading...",
                icon: "⚠️"
            }
        };
        this.applyContent();
    }

    // Direct update function that bypasses all caching
    async directUpdateFromFirebase() {
        try {
            const { db, collection, getDocs } = window.firebaseApp;
            
            // Get all documents from website collection
            const websiteSnapshot = await getDocs(collection(db, 'website'));
            
            console.log('=== DIRECT FIREBASE UPDATE ===');
            websiteSnapshot.forEach((doc) => {
                console.log('Document:', doc.id, 'Data:', doc.data());
            });
            
            // Find content document
            let contentData = null;
            let noticeData = null;
            
            websiteSnapshot.forEach((doc) => {
                const data = doc.data();
                if (doc.id === 'content') {
                    contentData = data;
                }
                if (doc.id === 'notice' || data.id === 'notice') {
                    noticeData = data;
                }
            });
            
            // Update homepage directly
            if (contentData && contentData.home) {
                const heroDescription = document.getElementById('hero-description');
                const heroImage = document.getElementById('hero-image');
                const heroImageContainer = document.querySelector('.hero-image');
                
                if (heroDescription) {
                    heroDescription.textContent = contentData.home.description;
                    console.log('DIRECT UPDATE: Description set to:', contentData.home.description);
                }
                
                // Handle media (image or video)
                if (heroImageContainer && (contentData.home.image || contentData.home.video)) {
                    const mediaType = contentData.home.mediaType || 'image';
                    const mediaUrl = mediaType === 'video' ? contentData.home.video : contentData.home.image;
                    
                    if (mediaUrl) {
                        // Check if it's a social media link and convert it
                        const processedMedia = this.processSocialMediaUrl(mediaUrl, mediaType);
                        
                        if (processedMedia.type === 'embed') {
                            // Handle social media embeds
                            this.createSocialMediaEmbed(heroImageContainer, processedMedia, contentData.home.title);
                            console.log('DIRECT UPDATE: Social media embed created for:', processedMedia.platform);
                        } else if (processedMedia.type === 'video') {
                            // Create video element
                            const video = document.createElement('video');
                            video.id = 'hero-video';
                            video.src = processedMedia.url;
                            video.controls = true;
                            video.autoplay = false;
                            video.loop = true;
                            video.muted = true;
                            video.style.width = '100%';
                            video.style.height = '100%';
                            video.style.objectFit = 'cover';
                            video.style.borderRadius = '12px';
                            
                            // Clear container and add video
                            heroImageContainer.innerHTML = '';
                            heroImageContainer.appendChild(video);
                            
                            // Hide placeholder
                            const placeholder = document.getElementById('image-placeholder');
                            if (placeholder) placeholder.style.display = 'none';
                            
                            console.log('DIRECT UPDATE: Video set to:', processedMedia.url);
                        } else {
                            // Handle image
                if (heroImage) {
                                heroImage.src = processedMedia.url;
                                heroImage.style.display = 'block';
                                
                                // Hide placeholder
                                const placeholder = document.getElementById('image-placeholder');
                                if (placeholder) placeholder.style.display = 'none';
                                
                                console.log('DIRECT UPDATE: Image set to:', processedMedia.url);
                            }
                        }
                    }
                }
            }
            
            // Update notice directly
            if (noticeData) {
                const noticeBanner = document.getElementById('website-notice');
                const noticeText = noticeBanner.querySelector('.notice-text');
                const noticeIcon = noticeBanner.querySelector('.notice-icon');
                
                if (noticeBanner && noticeData.enabled) {
                    noticeBanner.style.display = 'block';
                    if (noticeText) {
                        noticeText.textContent = noticeData.text;
                        console.log('DIRECT UPDATE: Notice text set to:', noticeData.text);
                    }
                    if (noticeIcon) {
                        noticeIcon.textContent = noticeData.icon;
                        console.log('DIRECT UPDATE: Notice icon set to:', noticeData.icon);
                    }
                }
                
                // Update theme color after direct notice update
                if (typeof updateThemeColor === 'function') {
                    updateThemeColor();
                }
            }
            
            console.log('=== DIRECT UPDATE COMPLETE ===');
            
        } catch (error) {
            console.error('Direct update error:', error);
        }
    }

    applyContent() {
        console.log('🎯 applyContent() called!');
        console.log('📊 Content structure:', this.content);
        
        // Apply home content
        if (this.content.home) {
            console.log('✅ Home content found, calling updateHomeContent()');
            this.updateHomeContent();
        } else {
            console.log('❌ No home content found in this.content.home');
        }

        // DISABLED: Don't override about content - keep original HTML
        // Apply about content
        // if (this.content.about) {
        //     this.updateAboutContent();
        // }

        // Apply notice content
        if (this.content.notice) {
            this.updateNoticeContent();
        }

        // Make content available globally
        window.websiteData = this.content;
    }


    updateHomeContent() {
        const home = this.content.home;
        
        console.log('🏠 updateHomeContent() called!');
        console.log('📋 Home content data:', home);
        console.log('🔍 Full content object:', this.content);
        
        // Update hero section - use correct IDs
        const heroDescription = document.getElementById('hero-description');
        const heroImage = document.getElementById('hero-image');
        const heroImageContainer = document.querySelector('.hero-image');
        
        console.log('Hero elements found:', {
            description: !!heroDescription,
            image: !!heroImage,
            container: !!heroImageContainer
        });
        
        if (heroDescription && home.description) {
            heroDescription.textContent = home.description;
            console.log('Updated hero description to:', home.description);
        }
        
        // Handle media (image or video)
        if (heroImageContainer && (home.image || home.video)) {
            const mediaType = home.mediaType || 'image';
            const mediaUrl = mediaType === 'video' ? home.video : home.image;
            
            if (mediaUrl) {
                console.log(`Updating hero ${mediaType} to:`, mediaUrl);
                
                // Check if it's a social media link and convert it
                const processedMedia = this.processSocialMediaUrl(mediaUrl, mediaType);
                
                if (processedMedia.type === 'embed') {
                    // Handle social media embeds
                    this.createSocialMediaEmbed(heroImageContainer, processedMedia, home.title);
                } else if (processedMedia.type === 'video') {
                    // Create video element
                    const video = document.createElement('video');
                    video.id = 'hero-video';
                    video.src = processedMedia.url;
                    video.controls = true;
                    video.autoplay = false;
                    video.loop = true;
                    video.muted = true;
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    video.style.borderRadius = '12px';
                    video.alt = home.title || 'Hero Video';
                    
                    // Clear container and add video
                    heroImageContainer.innerHTML = '';
                    heroImageContainer.appendChild(video);
                    
                    // Hide placeholder
                    const placeholder = document.getElementById('image-placeholder');
                    if (placeholder) placeholder.style.display = 'none';
                    
                    console.log('Updated hero video to:', processedMedia.url);
                } else {
                    // Handle image (existing functionality)
                    if (heroImage) {
                        heroImage.src = processedMedia.url;
            heroImage.alt = home.title || 'Hero Image';
                        heroImage.style.display = 'block';
                        
                        // Hide placeholder
                        const placeholder = document.getElementById('image-placeholder');
                        if (placeholder) placeholder.style.display = 'none';
                        
                        console.log('Updated hero image to:', processedMedia.url);
                    }
                }
            }
        }

        // Update meta tags
        if (home.title) {
            document.title = home.title;
            const metaTitle = document.querySelector('meta[property="og:title"]');
            if (metaTitle) metaTitle.content = home.title;
        }
        
        if (home.description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (metaDescription) metaDescription.content = home.description;
            if (ogDescription) ogDescription.content = home.description;
        }
        
        // Update meta image/video
        const mediaUrl = home.mediaType === 'video' ? home.video : home.image;
        if (mediaUrl) {
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) ogImage.content = mediaUrl;
        }
    }

    // Process social media URLs and convert them to proper formats
    processSocialMediaUrl(url, mediaType) {
        console.log('Processing social media URL:', url, 'Type:', mediaType);
        
        // Facebook post detection
        if (url.includes('facebook.com') || url.includes('fb.com')) {
            return {
                type: 'embed',
                platform: 'facebook',
                url: url,
                embedUrl: this.convertFacebookToEmbed(url)
            };
        }
        
        // TikTok video detection
        if (url.includes('tiktok.com')) {
            return {
                type: 'embed',
                platform: 'tiktok',
                url: url,
                embedUrl: this.convertTikTokToEmbed(url)
            };
        }
        
        // YouTube video detection
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return {
                type: 'embed',
                platform: 'youtube',
                url: url,
                embedUrl: this.convertYouTubeToEmbed(url)
            };
        }
        
        // Instagram post detection
        if (url.includes('instagram.com')) {
            return {
                type: 'embed',
                platform: 'instagram',
                url: url,
                embedUrl: this.convertInstagramToEmbed(url)
            };
        }
        
        // Twitter/X post detection
        if (url.includes('twitter.com') || url.includes('x.com')) {
            return {
                type: 'embed',
                platform: 'twitter',
                url: url,
                embedUrl: this.convertTwitterToEmbed(url)
            };
        }
        
        // Direct image/video URL (not social media)
        return {
            type: mediaType,
            platform: 'direct',
            url: url
        };
    }

    // Convert Facebook post URL to embed format
    convertFacebookToEmbed(url) {
        // Facebook embed format: https://www.facebook.com/plugins/post.php?href=POST_URL
        const encodedUrl = encodeURIComponent(url);
        return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`;
    }

    // Convert TikTok video URL to embed format
    convertTikTokToEmbed(url) {
        // TikTok embed format: https://www.tiktok.com/embed/video/VIDEO_ID
        const videoIdMatch = url.match(/\/video\/(\d+)/);
        if (videoIdMatch) {
            return `https://www.tiktok.com/embed/video/${videoIdMatch[1]}`;
        }
        return url; // Fallback to original URL
    }

    // Convert YouTube video URL to embed format
    convertYouTubeToEmbed(url) {
        let videoId = '';
        
        // Handle different YouTube URL formats
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url; // Fallback to original URL
    }

    // Convert Instagram post URL to embed format
    convertInstagramToEmbed(url) {
        // Instagram embed format: https://www.instagram.com/p/POST_ID/embed/
        const postIdMatch = url.match(/\/p\/([^\/]+)/);
        if (postIdMatch) {
            return `https://www.instagram.com/p/${postIdMatch[1]}/embed/`;
        }
        return url; // Fallback to original URL
    }

    // Convert Twitter/X post URL to embed format
    convertTwitterToEmbed(url) {
        // Twitter embed format: https://platform.twitter.com/embed/Tweet.html?id=TWEET_ID
        const tweetIdMatch = url.match(/\/status\/(\d+)/);
        if (tweetIdMatch) {
            return `https://platform.twitter.com/embed/Tweet.html?id=${tweetIdMatch[1]}`;
        }
        return url; // Fallback to original URL
    }

    // Create social media embed
    createSocialMediaEmbed(container, mediaData, title) {
        console.log('Creating social media embed:', mediaData);
        
        // Clear container
        container.innerHTML = '';
        
        // Create iframe for embed
        const iframe = document.createElement('iframe');
        iframe.src = mediaData.embedUrl;
        iframe.width = '100%';
        iframe.height = '400px';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.style.borderRadius = '12px';
        iframe.style.border = 'none';
        
        // Platform-specific settings
        switch (mediaData.platform) {
            case 'facebook':
                iframe.allow = 'encrypted-media';
                break;
            case 'tiktok':
                iframe.allow = 'encrypted-media';
                break;
            case 'youtube':
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                break;
            case 'instagram':
                iframe.allow = 'encrypted-media';
                break;
            case 'twitter':
                iframe.allow = 'encrypted-media';
                break;
        }
        
        // Add fallback content
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: var(--card-bg);
            border: 2px solid var(--card-border);
            border-radius: 12px;
            text-align: center;
        `;
        
        fallback.innerHTML = `
            <h3>${mediaData.platform.charAt(0).toUpperCase() + mediaData.platform.slice(1)} Content</h3>
            <p>Loading ${mediaData.platform} content...</p>
            <a href="${mediaData.url}" target="_blank" rel="noopener noreferrer" 
               style="color: var(--glow-color); text-decoration: none; margin-top: 1rem;">
                View on ${mediaData.platform.charAt(0).toUpperCase() + mediaData.platform.slice(1)}
            </a>
        `;
        
        // Add iframe to container
        container.appendChild(iframe);
        
        // Hide placeholder
        const placeholder = document.getElementById('image-placeholder');
        if (placeholder) placeholder.style.display = 'none';
        
        // Handle iframe load error
        iframe.onerror = () => {
            console.log('Iframe failed to load, showing fallback');
            container.innerHTML = '';
            container.appendChild(fallback);
        };
        
        console.log('Social media embed created for:', mediaData.platform);
    }

    updateNoticeContent() {
        const notice = this.content.notice;
        const noticeBanner = document.getElementById('website-notice');
        
        console.log('Updating notice content:', notice);
        console.log('Notice banner element:', noticeBanner);
        
        if (!noticeBanner) {
            console.error('Notice banner not found!');
            return;
        }

        if (notice && notice.enabled) {
            noticeBanner.style.display = 'block';
            noticeBanner.classList.remove('hidden');
            
            const noticeIcon = noticeBanner.querySelector('.notice-icon');
            const noticeText = noticeBanner.querySelector('.notice-text');
            
            console.log('Notice icon element:', noticeIcon);
            console.log('Notice text element:', noticeText);
            
            if (noticeIcon && notice.icon) {
                noticeIcon.textContent = notice.icon;
                console.log('Updated notice icon to:', notice.icon);
            }
            
            if (noticeText && notice.text) {
                noticeText.textContent = notice.text;
                console.log('Updated notice text to:', notice.text);
            }
        } else {
            noticeBanner.style.display = 'none';
            noticeBanner.classList.add('hidden');
            console.log('Notice disabled or not found');
        }
        
        // Update theme color when notice content changes
        if (typeof updateThemeColor === 'function') {
            updateThemeColor();
        }
    }

    // Force update notice with Firebase data
    async forceUpdateNotice() {
        try {
            console.log('Firebase app available:', !!window.firebaseApp);
            
            // Use the same method as the working rating system
            const { db, collection, getDocs } = window.firebaseApp;
            
            // Get all documents from the website collection
            const websiteSnapshot = await getDocs(collection(db, 'website'));
            
            console.log('Website collection documents:');
            websiteSnapshot.forEach((doc) => {
                console.log('Document ID:', doc.id, 'Data:', doc.data());
            });
            
            let noticeData = null;
            websiteSnapshot.forEach((doc) => {
                const data = doc.data();
                if (doc.id === 'notice' || data.id === 'notice') {
                    noticeData = data;
                }
            });
            
            if (noticeData) {
                console.log('Force loaded notice data:', noticeData);
                
                const noticeBanner = document.getElementById('website-notice');
                const noticeIcon = noticeBanner.querySelector('.notice-icon');
                const noticeText = noticeBanner.querySelector('.notice-text');
                
                if (noticeData.enabled) {
                    noticeBanner.style.display = 'block';
                    if (noticeIcon) noticeIcon.textContent = noticeData.icon || '⚠️';
                    if (noticeText) noticeText.textContent = noticeData.text || 'Loading...';
                    console.log('Force updated notice with:', noticeData.text);
                } else {
                    noticeBanner.style.display = 'none';
                }
                
                // Update theme color after force updating notice
                if (typeof updateThemeColor === 'function') {
                    updateThemeColor();
                }
            } else {
                console.log('Notice document not found in website collection');
                console.log('Available documents:', websiteSnapshot.docs.map(doc => doc.id));
            }
        } catch (error) {
            console.error('Error force updating notice:', error);
        }
    }

    // Method to refresh content (useful for real-time updates)
    async refreshContent() {
        await this.loadContent();
    }

    // Force update Firebase content with correct about text
    async forceUpdateAboutContent() {
        try {
            const { db, doc, updateDoc } = window.firebaseApp;
            
            const correctAboutContent = {
                about: {
                    title: "About Me",
                    content: "Hi, My gaming name is Masg685 and I'm from Australia, I was born on the island of Savai'i in Samoa.<br><br>In 2023, I started playing Emergency Hamburg, a roleplay game from Germany. I've earned over 300,000 XP as police officer, which is known as one of the best teams in the game.<br><br>Later, I started creating content on social Media beginning with Youtube and then expanding to TikTok. if you haven't subscribed yet, please do it really helps me out."
                },
                emergencyHamburg: {
                    title: "Emergency Hamburg",
                    stats: {
                        gamepass: "+9",
                        policeXp: "+340,610XP Total",
                        fireMedicalXp: "+21,270XP Total",
                        truckXp: "+1,721XP Total",
                        adacXp: "+2,341XP Total",
                        busDriverXp: "+1,454XP Total"
                    }
                }
            };

            await updateDoc(doc(db, 'website', 'content'), correctAboutContent);
            console.log('About content force updated in Firebase');
            
            // Reload content
            await this.loadContent();
            
        } catch (error) {
            console.error('Error force updating about content:', error);
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
        }
    }

    // Set up real-time listeners for content updates
    setupRealtimeListeners() {
        try {
            const { db, doc, onSnapshot } = window.firebaseApp;
            
            // Listen for content changes
            onSnapshot(doc(db, 'website', 'content'), (doc) => {
                console.log('🔥 Real-time content update detected!', doc.exists() ? 'Document exists' : 'Document does not exist');
                if (doc.exists()) {
                    const newData = doc.data();
                    console.log('📄 New content data:', newData);
                    this.content = { ...this.content, ...newData };
                    console.log('🔄 Applying content updates...');
                    this.applyContent();
                    console.log('✅ Content updated in real-time successfully');
                } else {
                    console.log('❌ Content document does not exist in Firebase');
                }
            });

            // Listen for notice changes
            onSnapshot(doc(db, 'website', 'notice'), (doc) => {
                if (doc.exists()) {
                    this.content.notice = doc.data();
                    this.updateNoticeContent();
                    console.log('Notice updated in real-time:', this.content.notice);
                }
            });

        } catch (error) {
            console.error('Error setting up real-time listeners:', error);
        }
    }
}

// Initialize the content manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.firebaseContentManager = new FirebaseContentManager();
});

// Global function to test real-time updates
window.testContentUpdate = () => {
    console.log('🧪 Testing content update...');
    if (window.firebaseContentManager) {
        console.log('📋 Current content:', window.firebaseContentManager.content);
        console.log('🔄 Calling applyContent()...');
        window.firebaseContentManager.applyContent();
        console.log('✅ Test complete!');
    } else {
        console.log('❌ Firebase content manager not found!');
    }
};

// Global function to force reload content from Firebase
window.forceReloadContent = async () => {
    console.log('🔄 Force reloading content from Firebase...');
    if (window.firebaseContentManager) {
        await window.firebaseContentManager.loadContent();
        console.log('✅ Content reloaded!');
    } else {
        console.log('❌ Firebase content manager not found!');
    }
};

// Global function to force update about content
window.forceUpdateAboutContent = async () => {
    if (window.firebaseContentManager) {
        await window.firebaseContentManager.forceUpdateAboutContent();
        console.log('About content force updated!');
    } else {
        console.error('Firebase content manager not found!');
    }
};

// Manual refresh function for testing
window.refreshFirebaseContent = async () => {
    if (window.firebaseContentManager) {
        console.log('Manually refreshing Firebase content...');
        await window.firebaseContentManager.refreshContent();
    } else {
        console.error('Firebase content manager not found!');
    }
};

// Simple test function to force update notice
window.testNotice = () => {
    const noticeText = document.querySelector('.notice-text');
    const noticeIcon = document.querySelector('.notice-icon');
    const noticeBanner = document.getElementById('website-notice');
    
    if (noticeText) {
        noticeText.textContent = 'TEST NOTICE FROM FIREBASE';
        console.log('Updated notice text to: TEST NOTICE FROM FIREBASE');
    }
    
    if (noticeBanner) {
        noticeBanner.style.display = 'block';
        console.log('Made notice banner visible');
    }
    
    console.log('Test notice function completed');
};

// Test Firebase notice loading
window.testFirebaseNotice = async () => {
    if (window.firebaseContentManager) {
        console.log('Testing Firebase notice loading...');
        await window.firebaseContentManager.forceUpdateNotice();
    } else {
        console.error('Firebase content manager not found!');
    }
};

// DIRECT UPDATE - This will definitely work
window.directUpdate = async () => {
    if (window.firebaseContentManager) {
        console.log('Starting DIRECT update from Firebase...');
        await window.firebaseContentManager.directUpdateFromFirebase();
    } else {
        console.error('Firebase content manager not found!');
    }
};

// Create missing notice document
window.createNoticeDocument = async () => {
    try {
        console.log('Available Firebase functions:', Object.keys(window.firebaseApp));
        
        const { db, collection, addDoc } = window.firebaseApp;
        
        const noticeData = {
            enabled: true,
            text: "Notice: Test",
            icon: "⚠️"
        };
        
        // Add document to website collection with ID 'notice'
        await addDoc(collection(db, 'website'), {
            id: 'notice',
            ...noticeData
        });
        console.log('Notice document created successfully!');
        
        // Now test loading it
        await window.testFirebaseNotice();
        
    } catch (error) {
        console.error('Error creating notice document:', error);
    }
};

// Helper function to update home page image/video from external URL
window.updateHomeMedia = async (mediaUrl, mediaType = 'image', description = null) => {
    try {
        if (!window.firebaseApp) {
            console.error('Firebase not available');
            return;
        }
        
        const { db, doc, updateDoc } = window.firebaseApp;
        
        // Check if it's a social media URL and set appropriate media type
        let finalMediaType = mediaType;
        if (mediaUrl.includes('facebook.com') || mediaUrl.includes('fb.com') ||
            mediaUrl.includes('tiktok.com') || mediaUrl.includes('youtube.com') ||
            mediaUrl.includes('youtu.be') || mediaUrl.includes('instagram.com') ||
            mediaUrl.includes('twitter.com') || mediaUrl.includes('x.com')) {
            finalMediaType = 'image'; // Social media embeds are treated as images in the UI
            console.log('Detected social media URL, setting media type to image for embed display');
        }
        
        const updateData = {
            home: {
                mediaType: finalMediaType,
                [finalMediaType]: mediaUrl
            }
        };
        
        if (description) {
            updateData.home.description = description;
        }
        
        await updateDoc(doc(db, 'website', 'content'), updateData);
        console.log(`Home ${finalMediaType} updated to:`, mediaUrl);
        
        // Force refresh content
        if (window.firebaseContentManager) {
            await window.firebaseContentManager.refreshContent();
        }
        
        return true;
    } catch (error) {
        console.error('Error updating home media:', error);
        return false;
    }
};

// Helper function to update home page description
window.updateHomeDescription = async (description) => {
    try {
        if (!window.firebaseApp) {
            console.error('Firebase not available');
            return;
        }
        
        const { db, doc, updateDoc } = window.firebaseApp;
        
        await updateDoc(doc(db, 'website', 'content'), {
            'home.description': description
        });
        
        console.log('Home description updated to:', description);
        
        // Force refresh content
        if (window.firebaseContentManager) {
            await window.firebaseContentManager.refreshContent();
        }
        
        return true;
    } catch (error) {
        console.error('Error updating home description:', error);
        return false;
    }
};

// Helper function to set external image URL
window.setExternalImage = async (imageUrl, description = null) => {
    return await window.updateHomeMedia(imageUrl, 'image', description);
};

// Helper function to set external video URL
window.setExternalVideo = async (videoUrl, description = null) => {
    return await window.updateHomeMedia(videoUrl, 'video', description);
};

// Example usage functions for common social media platforms
window.setFacebookImage = async (facebookImageUrl, description = null) => {
    console.log('Setting Facebook image:', facebookImageUrl);
    return await window.setExternalImage(facebookImageUrl, description);
};

window.setInstagramImage = async (instagramImageUrl, description = null) => {
    console.log('Setting Instagram image:', instagramImageUrl);
    return await window.setExternalImage(instagramImageUrl, description);
};

window.setTikTokVideo = async (tiktokVideoUrl, description = null) => {
    console.log('Setting TikTok video:', tiktokVideoUrl);
    return await window.setExternalVideo(tiktokVideoUrl, description);
};

window.setYouTubeVideo = async (youtubeVideoUrl, description = null) => {
    console.log('Setting YouTube video:', youtubeVideoUrl);
    return await window.setExternalVideo(youtubeVideoUrl, description);
};

// Function to test external media URLs
window.testExternalMedia = async () => {
    console.log('🧪 Testing external media functionality...');
    
    // Test with a sample external image
    const testImageUrl = 'https://via.placeholder.com/800x400/4a90e2/ffffff?text=External+Image+Test';
    const success = await window.setExternalImage(testImageUrl, 'Test external image from placeholder service');
    
    if (success) {
        console.log('✅ External image test successful!');
    } else {
        console.log('❌ External image test failed!');
    }
    
    return success;
};

// Function to show current media settings
window.showCurrentMedia = () => {
    if (window.firebaseContentManager && window.firebaseContentManager.content.home) {
        const home = window.firebaseContentManager.content.home;
        console.log('📊 Current home media settings:');
        console.log('Media Type:', home.mediaType || 'image');
        console.log('Image URL:', home.image || 'Not set');
        console.log('Video URL:', home.video || 'Not set');
        console.log('Description:', home.description || 'Not set');
    } else {
        console.log('❌ No content data available');
    }
};

// Function to test social media URL processing
window.testSocialMediaUrl = (url) => {
    if (window.firebaseContentManager) {
        const processed = window.firebaseContentManager.processSocialMediaUrl(url, 'image');
        console.log('🔍 Social Media URL Test:');
        console.log('Original URL:', url);
        console.log('Processed:', processed);
        return processed;
    } else {
        console.log('❌ Firebase content manager not available');
        return null;
    }
};

// Function to set social media content
window.setSocialMediaContent = async (url, description = null) => {
    console.log('📱 Setting social media content:', url);
    return await window.updateHomeMedia(url, 'image', description);
};
