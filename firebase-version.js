// Firebase Version Management System
// This script automatically loads and updates version information across all pages

class VersionManager {
    constructor() {
        this.version = 'Loading...'; // Fallback version
        this.updateTitle = 'Loading Update...'; // Fallback title
        this.init();
    }

    async init() {
        // Wait for Firebase to be available
        if (!window.firebaseApp) {
            console.log('Waiting for Firebase to load for version management...');
            setTimeout(() => this.init(), 100);
            return;
        }

        console.log('Firebase loaded, initializing version management...');
        await this.loadVersion();
        
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            this.updateVersionElements();
        }, 100);
        
        this.setupRealtimeListener();
    }

    async loadVersion() {
        try {
            const { db, collection, doc, getDoc } = window.firebaseApp;
            const versionDoc = await getDoc(doc(db, 'version', 'current'));
            
            if (versionDoc.exists()) {
                const data = versionDoc.data();
                this.version = data.version || 'Loading...';
                this.updateTitle = data.updateTitle || `Website Update ${this.version}`;
                this.updateDescription = data.description || 'No update description available.';
                this.updateDate = data.lastUpdated || new Date().toISOString();
                console.log('Version loaded from Firebase:', this.version);
                console.log('Update description:', this.updateDescription);
            } else {
                console.log('No version document found, using fallback version');
            }
        } catch (error) {
            console.error('Error loading version from Firebase:', error);
            console.log('Using fallback version:', this.version);
        }
    }

    updateVersionElements() {
        // Update all version links in navbar
        const versionLinks = document.querySelectorAll('.version-link');
        console.log('Found version links:', versionLinks.length);
        versionLinks.forEach(link => {
            link.textContent = this.version;
            console.log('Updated version link to:', this.version);
        });

        // Update version spans (if any)
        const versionSpans = document.querySelectorAll('.brand-version');
        console.log('Found version spans:', versionSpans.length);
        versionSpans.forEach(span => {
            const link = span.querySelector('.version-link');
            if (link) {
                link.textContent = this.version;
                console.log('Updated version span link to:', this.version);
            }
        });

        // Update version badge if on update page
        const versionBadge = document.getElementById('version-badge');
        if (versionBadge) {
            versionBadge.textContent = this.version;
            console.log('Updated version badge to:', this.version);
        }

        // Update update page title if on update page
        const updateTitle = document.getElementById('update-title');
        if (updateTitle) {
            updateTitle.textContent = this.updateTitle;
            console.log('Updated update title to:', this.updateTitle);
        }

        // Update update date if on update page
        const updateDate = document.getElementById('update-date');
        if (updateDate && this.updateDate) {
            const date = new Date(this.updateDate);
            updateDate.textContent = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            console.log('Updated update date to:', updateDate.textContent);
        }

        // Update update description if on update page
        const updateDescription = document.getElementById('update-description');
        if (updateDescription && this.updateDescription) {
            // Clear loading content
            updateDescription.innerHTML = '';
            
            // Create description paragraphs
            const descriptionLines = this.updateDescription.split('\n').filter(line => line.trim());
            descriptionLines.forEach(line => {
                const p = document.createElement('p');
                p.textContent = line.trim();
                updateDescription.appendChild(p);
            });
            
            console.log('Updated update description');
        }

        console.log('Version elements updated to:', this.version);
    }

    setupRealtimeListener() {
        try {
            const { db, collection, doc, onSnapshot } = window.firebaseApp;
            
            // Listen for version changes in real-time
            onSnapshot(doc(db, 'version', 'current'), (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    const newVersion = data.version || 'Loading...';
                    const newUpdateTitle = data.updateTitle || `Website Update ${newVersion}`;
                    const newUpdateDescription = data.description || 'No update description available.';
                    const newUpdateDate = data.lastUpdated || new Date().toISOString();
                    
                    // Update all data
                    this.version = newVersion;
                    this.updateTitle = newUpdateTitle;
                    this.updateDescription = newUpdateDescription;
                    this.updateDate = newUpdateDate;
                    
                    // Wait a bit for DOM to be ready, then update
                    setTimeout(() => {
                        this.updateVersionElements();
                    }, 100);
                    
                    // Show a subtle notification that version was updated
                    this.showVersionUpdateNotification(newVersion);
                }
            });
            
            console.log('Version real-time listener set up');
        } catch (error) {
            console.error('Error setting up version listener:', error);
        }
    }

    showVersionUpdateNotification(newVersion) {
        // Create a subtle notification that version was updated
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4a90e2;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = `Version updated to ${newVersion}`;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to manually update version (for admin use)
    async updateVersion(newVersion, newUpdateTitle = null, newDescription = null) {
        try {
            const { db, collection, doc, setDoc } = window.firebaseApp;
            const versionData = {
                version: newVersion,
                updateTitle: newUpdateTitle || `Website Update ${newVersion}`,
                description: newDescription || 'No update description available.',
                lastUpdated: new Date().toISOString()
            };
            
            await setDoc(doc(db, 'version', 'current'), versionData);
            console.log('Version updated successfully to:', newVersion);
            return true;
        } catch (error) {
            console.error('Error updating version:', error);
            return false;
        }
    }
}

// Initialize version manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.versionManager = new VersionManager();
});

// Global function to update version (for admin use)
async function updateWebsiteVersion(newVersion, newUpdateTitle = null, newDescription = null) {
    if (window.versionManager) {
        return await window.versionManager.updateVersion(newVersion, newUpdateTitle, newDescription);
    } else {
        console.error('Version manager not initialized');
        return false;
    }
}

// Global function to manually refresh version display (for debugging)
function refreshVersionDisplay() {
    if (window.versionManager) {
        console.log('Manually refreshing version display...');
        window.versionManager.updateVersionElements();
        return true;
    } else {
        console.error('Version manager not initialized');
        return false;
    }
}

// Global function to force reload version from Firebase
async function reloadVersionFromFirebase() {
    if (window.versionManager) {
        console.log('Manually reloading version from Firebase...');
        await window.versionManager.loadVersion();
        window.versionManager.updateVersionElements();
        return true;
    } else {
        console.error('Version manager not initialized');
        return false;
    }
}
