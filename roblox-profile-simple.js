// Simple Roblox Profile Integration - No CORS issues
class SimpleRobloxProfile {
    constructor() {
        this.userId = '5255024681';
        this.updateInterval = 15000; // 15 seconds for faster avatar updates
        this.autoUpdateTimer = null;
        this.isLoading = false;
        
        this.initializeProfile();
    }

    async initializeProfile() {
        try {
            // Load profile data immediately
            await this.loadProfileData();
            
            // Set up auto-refresh
            this.startAutoUpdate();
            
            // Set up manual refresh button
            this.setupRefreshButton();
            
            console.log('Simple Roblox profile initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Roblox profile:', error);
            this.showError('Failed to load profile data');
        }
    }

    async loadProfileData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();

        try {
            // Try to fetch data using a simple approach
            const userData = await this.fetchUserDataSimple();
            
            // Update the UI with the fetched data
            this.updateProfileInfo(userData);
            this.updateAvatarSimple();
            this.updateLastUpdatedTime();

            console.log('Profile data loaded successfully');
        } catch (error) {
            console.error('Error loading profile data:', error);
            
            // Show sample data if API fails completely
            this.showSampleData();
            this.showError('Using sample data - API connection failed. Check console for details.');
        } finally {
            this.isLoading = false;
            this.hideLoadingState();
        }
    }

    async fetchUserDataSimple() {
        try {
            // Use a simple fetch with no-cors mode as fallback
            const response = await fetch(`https://users.roblox.com/v1/users/${this.userId}`, {
                mode: 'no-cors'
            });
            
            // Since no-cors doesn't give us the response body, we'll use sample data
            // But we'll try a different approach first
            return await this.fetchWithProxy();
        } catch (error) {
            console.error('Simple fetch failed:', error);
            throw error;
        }
    }

    async fetchWithProxy() {
        // Try using a different approach - JSONP or direct fetch
        try {
            // Create a script tag to bypass CORS (JSONP-like approach)
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://users.roblox.com/v1/users/${this.userId}?callback=handleRobloxData`;
                
                window.handleRobloxData = (data) => {
                    document.head.removeChild(script);
                    delete window.handleRobloxData;
                    resolve(data);
                };
                
                script.onerror = () => {
                    document.head.removeChild(script);
                    delete window.handleRobloxData;
                    reject(new Error('Script load failed'));
                };
                
                document.head.appendChild(script);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    if (document.head.contains(script)) {
                        document.head.removeChild(script);
                        delete window.handleRobloxData;
                        reject(new Error('Request timeout'));
                    }
                }, 10000);
            });
        } catch (error) {
            console.error('Proxy fetch failed:', error);
            throw error;
        }
    }

    showSampleData() {
        // Show sample data to demonstrate the layout
        const sampleData = {
            username: 'Masg685',
            displayName: 'Masg685',
            description: 'Emergency Hamburg Player | Content Creator | Game Developer',
            friendCount: 127,
            followerCount: 89
        };
        
        this.updateProfileInfo(sampleData);
        
        // Use a placeholder avatar
        const avatarElement = document.getElementById('roblox-avatar');
        if (avatarElement) {
            avatarElement.src = 'https://via.placeholder.com/150x150/4a90e2/ffffff?text=Avatar';
            avatarElement.style.display = 'block';
        }
        
        this.updateLastUpdatedTime();
    }

    updateProfileInfo(data) {
        // Update username
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = data.username || 'Unknown';
            usernameElement.style.color = '#4a90e2';
        }

        // Update display name
        const displayNameElement = document.getElementById('display-name');
        if (displayNameElement) {
            displayNameElement.textContent = data.displayName || data.username || 'Unknown';
            displayNameElement.style.color = '#4a90e2';
        }

        // Update description
        const descriptionElement = document.getElementById('description');
        if (descriptionElement) {
            descriptionElement.textContent = data.description || 'No description available';
            descriptionElement.style.color = '#4a90e2';
        }

        // Update friend count
        const friendCountElement = document.getElementById('friend-count');
        if (friendCountElement) {
            friendCountElement.textContent = this.formatNumber(data.friendCount);
            friendCountElement.style.color = '#4a90e2';
        }

        // Update follower count
        const followerCountElement = document.getElementById('follower-count');
        if (followerCountElement) {
            followerCountElement.textContent = this.formatNumber(data.followerCount);
            followerCountElement.style.color = '#4a90e2';
        }
    }

    updateAvatarSimple() {
        // Use a simple avatar approach with cache busting
        const avatarElement = document.getElementById('roblox-avatar');
        if (avatarElement) {
            // Add timestamp to force refresh and bypass cache
            const timestamp = new Date().getTime();
            const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${this.userId}&size=150x150&format=Png&isCircular=true&t=${timestamp}`;
            
            avatarElement.src = avatarUrl;
            avatarElement.style.display = 'block';
            
            // If avatar fails to load, use placeholder
            avatarElement.onerror = () => {
                avatarElement.src = 'https://via.placeholder.com/150x150/4a90e2/ffffff?text=Avatar';
            };
            
            // Also try to preload the next avatar to ensure it updates
            const nextAvatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${this.userId}&size=150x150&format=Png&isCircular=true&t=${timestamp + 1000}`;
            const preloadImg = new Image();
            preloadImg.src = nextAvatarUrl;
        }
    }

    updateLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            lastUpdatedElement.textContent = `Last updated: ${timeString}`;
            lastUpdatedElement.style.color = '#4a90e2';
        }
    }

    showLoadingState() {
        const avatarLoading = document.getElementById('avatar-loading');
        if (avatarLoading) {
            avatarLoading.style.display = 'flex';
        }

        // Show loading text for stats
        const loadingElements = ['username', 'display-name', 'description', 'friend-count', 'follower-count'];
        loadingElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Loading...';
                element.style.color = '#666';
            }
        });
    }

    hideLoadingState() {
        const avatarLoading = document.getElementById('avatar-loading');
        if (avatarLoading) {
            avatarLoading.style.display = 'none';
        }
    }

    showError(message) {
        console.error(message);
        
        // Show error in the UI
        const errorElements = ['username', 'display-name', 'description', 'friend-count', 'follower-count'];
        errorElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Error loading';
                element.style.color = '#e74c3c';
            }
        });

        // Show error for avatar
        const avatarElement = document.getElementById('roblox-avatar');
        if (avatarElement) {
            avatarElement.style.display = 'none';
        }

        const avatarLoading = document.getElementById('avatar-loading');
        if (avatarLoading) {
            avatarLoading.innerHTML = `
                <div style="text-align: center; color: #e74c3c;">
                    <p>Error loading avatar</p>
                    <p style="font-size: 0.8rem; margin-top: 0.5rem;">${message}</p>
                    <button onclick="window.simpleRobloxProfile.refresh()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
                </div>
            `;
            avatarLoading.style.display = 'flex';
        }

        // Show error message in the update info section
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = `Error: ${message}`;
            lastUpdatedElement.style.color = '#e74c3c';
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    setupRefreshButton() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadProfileData();
            });
        }
    }

    startAutoUpdate() {
        // Clear any existing timer
        if (this.autoUpdateTimer) {
            clearInterval(this.autoUpdateTimer);
        }

        // Set up new timer
        this.autoUpdateTimer = setInterval(() => {
            this.loadProfileData();
        }, this.updateInterval);

        console.log(`Auto-update started (every ${this.updateInterval / 1000} seconds)`);
    }

    stopAutoUpdate() {
        if (this.autoUpdateTimer) {
            clearInterval(this.autoUpdateTimer);
            this.autoUpdateTimer = null;
            console.log('Auto-update stopped');
        }
    }

    // Public method to manually refresh
    refresh() {
        this.loadProfileData();
    }

    // Cleanup method
    destroy() {
        this.stopAutoUpdate();
    }
}

// Initialize the simple Roblox profile when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize simple Roblox profile
    window.simpleRobloxProfile = new SimpleRobloxProfile();
    
    // Handle page visibility changes to pause/resume auto-updates
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause auto-updates
            if (window.simpleRobloxProfile) {
                window.simpleRobloxProfile.stopAutoUpdate();
            }
        } else {
            // Page is visible, resume auto-updates
            if (window.simpleRobloxProfile) {
                window.simpleRobloxProfile.startAutoUpdate();
                // Also refresh data when page becomes visible again
                window.simpleRobloxProfile.refresh();
            }
        }
    });

    // Handle page unload to cleanup
    window.addEventListener('beforeunload', function() {
        if (window.simpleRobloxProfile) {
            window.simpleRobloxProfile.destroy();
        }
    });
});
