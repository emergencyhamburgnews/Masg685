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
                    image: "img4.jpg"
                },
                about: {
                    title: "About Me",
                    content: "Hi, My gaming name is Masg685 and I'm from Australia, I was born on the island of Savai'i in Samoa.\n\nIn 2023, I started playing Emergency Hamburg, a roleplay game from Germany. I've earned over 300,000 XP as police officer, which is known as one of the best teams in the game.\n\nLater, I started creating content on social Media beginning with Youtube and then expanding to TikTok. if you haven't subscribed yet, please do it really helps me out."
                },
                emergencyHamburg: {
                    title: "Emergency Hamburg",
                    stats: {
                        gamepass: "+9",
                        policeXp: "+312,213XP Total",
                        fireMedicalXp: "+20,352XP Total",
                        truckXp: "+1,721XP Total",
                        adacXp: "+2,035XP Total",
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
        }
    }

    async createDefaultNotice() {
        try {
            const { db, doc, setDoc } = window.firebaseApp;
            
            const defaultNotice = {
                enabled: true,
                text: "Notice: My website is not fully finished yet.",
                icon: "⚠️"
            };

            await setDoc(doc(db, 'website', 'notice'), defaultNotice);
            this.content.notice = defaultNotice;
            console.log('Default notice created in Firebase');
        } catch (error) {
            console.error('Error creating default notice:', error);
        }
    }

    loadDefaultContent() {
        // Fallback content if Firebase fails
        this.content = {
            home: {
                title: "Masg685 - Home",
                description: "Join my RP private server in Emergency Hamburg. Experience the best roleplay with over 300,000 XP as police officer!",
                image: "img4.jpg"
            },
            notice: {
                enabled: true,
                text: "Notice: My website is not fully finished yet.",
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
                
                if (heroDescription) {
                    heroDescription.textContent = contentData.home.description;
                    console.log('DIRECT UPDATE: Description set to:', contentData.home.description);
                }
                
                if (heroImage) {
                    heroImage.src = contentData.home.image;
                    console.log('DIRECT UPDATE: Image set to:', contentData.home.image);
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
            }
            
            console.log('=== DIRECT UPDATE COMPLETE ===');
            
        } catch (error) {
            console.error('Direct update error:', error);
        }
    }

    applyContent() {
        // Apply home content
        if (this.content.home) {
            this.updateHomeContent();
        }

        // Apply notice content
        if (this.content.notice) {
            this.updateNoticeContent();
        }

        // Make content available globally
        window.websiteData = this.content;
    }

    updateHomeContent() {
        const home = this.content.home;
        
        console.log('Updating home content:', home);
        
        // Update hero section - use correct IDs
        const heroDescription = document.getElementById('hero-description');
        const heroImage = document.getElementById('hero-image');
        
        console.log('Hero elements found:', {
            description: !!heroDescription,
            image: !!heroImage
        });
        
        if (heroDescription && home.description) {
            heroDescription.textContent = home.description;
            console.log('Updated hero description to:', home.description);
        }
        
        if (heroImage && home.image) {
            heroImage.src = home.image;
            heroImage.alt = home.title || 'Hero Image';
            console.log('Updated hero image to:', home.image);
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
        
        if (home.image) {
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) ogImage.content = home.image;
        }
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
                    if (noticeText) noticeText.textContent = noticeData.text || 'Notice: My website is not fully finished yet.';
                    console.log('Force updated notice with:', noticeData.text);
                } else {
                    noticeBanner.style.display = 'none';
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

    // Set up real-time listeners for content updates
    setupRealtimeListeners() {
        try {
            const { db, doc, onSnapshot } = window.firebaseApp;
            
            // Listen for content changes
            onSnapshot(doc(db, 'website', 'content'), (doc) => {
                if (doc.exists()) {
                    this.content = { ...this.content, ...doc.data() };
                    this.applyContent();
                    console.log('Content updated in real-time');
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
