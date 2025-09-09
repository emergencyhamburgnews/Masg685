// Simple Firebase Content System - Works exactly like rating system
// Firebase will be available via window.firebaseApp

class SimpleFirebaseContent {
    constructor() {
        this.init();
    }

    async init() {
        // Wait for Firebase to be available
        if (!window.firebaseApp) {
            console.log('Waiting for Firebase to load...');
            setTimeout(() => this.init(), 100);
            return;
        }

        console.log('Firebase loaded successfully for content');

        // Load initial data
        try {
            await this.loadContent();
            await this.loadNotice();
            
            // Set up real-time listeners
            this.setupRealtimeListeners();
            
            console.log('Simple Firebase content system initialized successfully');
        } catch (error) {
            console.error('Error initializing Firebase content system:', error);
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
        }
    }

    // Load content from Firebase - EXACTLY like rating system
    async loadContent() {
        try {
            const { db, collection, getDocs } = window.firebaseApp;
            const contentSnapshot = await getDocs(collection(db, 'website'));
            
            console.log('Loading content from Firebase...');
            
            contentSnapshot.forEach((doc) => {
                console.log('Content document:', doc.id, doc.data());
                
                if (doc.id === 'content') {
                    const data = doc.data();
                    this.updateHomePage(data);
                }
            });
            
        } catch (error) {
            console.error('Error loading content:', error);
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
        }
    }

    // Load notice from Firebase - from separate notice collection
    async loadNotice() {
        try {
            const { db, collection, getDocs } = window.firebaseApp;
            const noticeSnapshot = await getDocs(collection(db, 'notice'));
            
            console.log('Loading notice from Firebase notice collection...');
            
            noticeSnapshot.forEach((doc) => {
                console.log('Notice document:', doc.id, doc.data());
                const data = doc.data();
                this.updateNotice(data);
            });
            
        } catch (error) {
            console.error('Error loading notice:', error);
            if (typeof playErrorSound === 'function') {
                playErrorSound();
            }
        }
    }

    // Update homepage - DIRECT HTML update
    updateHomePage(data) {
        console.log('Updating homepage with:', data);
        
        if (data.home) {
            // Update description
            const heroDescription = document.getElementById('hero-description');
            if (heroDescription && data.home.description) {
                heroDescription.textContent = data.home.description;
                console.log('Updated description to:', data.home.description);
            }
            
            // Update image
            const heroImage = document.getElementById('hero-image');
            if (heroImage && data.home.image) {
                heroImage.src = data.home.image;
                heroImage.alt = data.home.title || 'Hero Image';
                console.log('Updated image to:', data.home.image);
            }
        }
    }

    // Update notice - DIRECT HTML update
    updateNotice(data) {
        console.log('Updating notice with:', data);
        
        const noticeBanner = document.getElementById('website-notice');
        if (!noticeBanner) {
            console.log('Notice banner not found');
            return;
        }
        
        if (data.enabled) {
            noticeBanner.style.display = 'block';
            
            const noticeText = noticeBanner.querySelector('.notice-text');
            if (noticeText && data.text) {
                noticeText.textContent = data.text;
                console.log('Updated notice text to:', data.text);
            }
            
            const noticeIcon = noticeBanner.querySelector('.notice-icon');
            if (noticeIcon && data.icon) {
                noticeIcon.textContent = data.icon;
                console.log('Updated notice icon to:', data.icon);
            }
        } else {
            noticeBanner.style.display = 'none';
        }
    }

    // Set up real-time listeners - EXACTLY like rating system
    setupRealtimeListeners() {
        try {
            const { db, collection, onSnapshot } = window.firebaseApp;
            
            // Listen for content changes in website collection
            onSnapshot(collection(db, 'website'), (snapshot) => {
                console.log('Real-time website update received');
                snapshot.forEach((doc) => {
                    if (doc.id === 'content') {
                        this.updateHomePage(doc.data());
                    }
                });
            });
            
            // Listen for notice changes in notice collection
            onSnapshot(collection(db, 'notice'), (snapshot) => {
                console.log('Real-time notice update received');
                snapshot.forEach((doc) => {
                    this.updateNotice(doc.data());
                });
            });
            
            console.log('Real-time listeners set up');
        } catch (error) {
            console.error('Error setting up real-time listeners:', error);
        }
    }

    // Manual refresh function
    async refresh() {
        console.log('Manual refresh triggered');
        await this.loadContent();
        await this.loadNotice();
    }
}

// Initialize the system
let simpleContentSystem;

// Wait for page to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing simple content system');
    simpleContentSystem = new SimpleFirebaseContent();
});

// Global functions for testing
window.refreshContent = async () => {
    if (simpleContentSystem) {
        await simpleContentSystem.refresh();
    }
};

window.testContent = async () => {
    console.log('Testing content system...');
    if (simpleContentSystem) {
        await simpleContentSystem.loadContent();
        await simpleContentSystem.loadNotice();
    }
};

// Test ONLY the notice system
window.testNotice = async () => {
    console.log('Testing NOTICE system only...');
    if (simpleContentSystem) {
        await simpleContentSystem.loadNotice();
    }
};

// Force update notice directly
window.forceNotice = async () => {
    try {
        const { db, collection, getDocs } = window.firebaseApp;
        const noticeSnapshot = await getDocs(collection(db, 'notice'));
        
        console.log('=== FORCE NOTICE UPDATE ===');
        noticeSnapshot.forEach((doc) => {
            console.log('Notice document found:', doc.id, doc.data());
            const data = doc.data();
            
            const noticeBanner = document.getElementById('website-notice');
            if (noticeBanner) {
                noticeBanner.style.display = 'block';
                
                const noticeText = noticeBanner.querySelector('.notice-text');
                const noticeIcon = noticeBanner.querySelector('.notice-icon');
                
                if (noticeText) {
                    noticeText.textContent = data.text;
                    console.log('FORCE: Notice text set to:', data.text);
                }
                if (noticeIcon) {
                    noticeIcon.textContent = data.icon;
                    console.log('FORCE: Notice icon set to:', data.icon);
                }
            }
        });
        console.log('=== FORCE NOTICE COMPLETE ===');
    } catch (error) {
        console.error('Force notice error:', error);
    }
};
