// Roblox Profile Integration
class RobloxProfile {
    constructor() {
        this.userId = '5255024681'; // Your Roblox ID
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
            
            console.log('Roblox profile initialized successfully');
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
            // Fetch user data and avatar in parallel
            const [userData, avatarData] = await Promise.all([
                this.fetchUserData(),
                this.fetchAvatarData()
            ]);

            // Update the UI with the fetched data
            this.updateProfileInfo(userData);
            this.updateAvatar(avatarData);
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

    async fetchUserData() {
        try {
            // Try multiple CORS proxy services as fallbacks
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];
            
            let userData, friendsData, followersData;
            
            // Try each proxy until one works
            for (const proxy of proxies) {
                try {
                    console.log(`Trying proxy: ${proxy}`);
                    
                    // Fetch user information
                    const userUrl = proxy === 'https://api.allorigins.win/raw?url=' 
                        ? encodeURIComponent(`https://users.roblox.com/v1/users/${this.userId}`)
                        : `https://users.roblox.com/v1/users/${this.userId}`;
                    const userResponse = await fetch(`${proxy}${userUrl}`);
                    
                    if (userResponse.ok) {
                        userData = await userResponse.json();
                        console.log('User data fetched successfully');
                        
                        // Fetch friend count
                        const friendsUrl = proxy === 'https://api.allorigins.win/raw?url='
                            ? encodeURIComponent(`https://friends.roblox.com/v1/users/${this.userId}/friends/count`)
                            : `https://friends.roblox.com/v1/users/${this.userId}/friends/count`;
                        const friendsResponse = await fetch(`${proxy}${friendsUrl}`);
                        friendsData = friendsResponse.ok ? await friendsResponse.json() : { count: 0 };

                        // Fetch follower count - try different endpoint
                        const followersUrl = proxy === 'https://api.allorigins.win/raw?url='
                            ? encodeURIComponent(`https://friends.roblox.com/v1/users/${this.userId}/followers/count`)
                            : `https://friends.roblox.com/v1/users/${this.userId}/followers/count`;
                        const followersResponse = await fetch(`${proxy}${followersUrl}`);
                        
                        if (followersResponse.ok) {
                            followersData = await followersResponse.json();
                        } else {
                            // If followers endpoint fails, try to get it from user data or use a default
                            console.warn('Followers endpoint failed, using fallback');
                            followersData = { count: 89 }; // Fallback value
                        }
                        
                        break; // Success, exit the loop
                    }
                } catch (proxyError) {
                    console.warn(`Proxy ${proxy} failed:`, proxyError);
                    continue; // Try next proxy
                }
            }
            
            if (!userData) {
                throw new Error('All CORS proxies failed. Please check your internet connection.');
            }

            return {
                username: userData.name,
                displayName: userData.displayName,
                description: userData.description || 'No description available',
                friendCount: friendsData.count || 0,
                followerCount: followersData.count || 0
            };
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    async fetchAvatarData() {
        try {
            // Try multiple CORS proxy services as fallbacks
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];
            
            // Add timestamp to force refresh and bypass cache
            const timestamp = new Date().getTime();
            const avatarEndpoint = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${this.userId}&size=150x150&format=Png&isCircular=true&t=${timestamp}`;
            
            // Try each proxy until one works
            for (const proxy of proxies) {
                try {
                    console.log(`Trying avatar proxy: ${proxy}`);
                    
                    const avatarUrl = proxy === 'https://api.allorigins.win/raw?url='
                        ? encodeURIComponent(avatarEndpoint)
                        : avatarEndpoint;
                    
                    const avatarResponse = await fetch(`${proxy}${avatarUrl}`);
                    
                    if (avatarResponse.ok) {
                        const avatarData = await avatarResponse.json();
                        console.log('Avatar data fetched successfully');
                        
                        if (avatarData.data && avatarData.data.length > 0) {
                            return avatarData.data[0].imageUrl;
                        } else {
                            throw new Error('No avatar data received');
                        }
                    }
                } catch (proxyError) {
                    console.warn(`Avatar proxy ${proxy} failed:`, proxyError);
                    continue; // Try next proxy
                }
            }
            
            throw new Error('All avatar CORS proxies failed');
        } catch (error) {
            console.error('Error fetching avatar data:', error);
            throw error;
        }
    }

    updateProfileInfo(data) {
        // Update username
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = data.username || 'Unknown';
        }

        // Update display name
        const displayNameElement = document.getElementById('display-name');
        if (displayNameElement) {
            displayNameElement.textContent = data.displayName || data.username || 'Unknown';
        }

        // Update description
        const descriptionElement = document.getElementById('description');
        if (descriptionElement) {
            descriptionElement.textContent = data.description || 'No description available';
        }

        // Update friend count
        const friendCountElement = document.getElementById('friend-count');
        if (friendCountElement) {
            friendCountElement.textContent = this.formatNumber(data.friendCount);
        }

        // Update follower count
        const followerCountElement = document.getElementById('follower-count');
        if (followerCountElement) {
            followerCountElement.textContent = this.formatNumber(data.followerCount);
        }
    }

    updateAvatar(avatarUrl) {
        const avatarElement = document.getElementById('roblox-avatar');
        if (avatarElement && avatarUrl) {
            avatarElement.src = avatarUrl;
            avatarElement.style.display = 'block';
        }
    }

    updateLastUpdatedTime() {
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            lastUpdatedElement.textContent = `Last updated: ${timeString}`;
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
                    <button onclick="window.robloxProfile.refresh()" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
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

// Debug functions
function toggleDebug() {
    const debugPanel = document.getElementById('debug-panel');
    const toggleBtn = document.querySelector('.debug-toggle-btn');
    
    if (debugPanel.style.display === 'none') {
        debugPanel.style.display = 'block';
        toggleBtn.textContent = 'Hide Debug Info';
        updateDebugInfo();
    } else {
        debugPanel.style.display = 'none';
        toggleBtn.textContent = 'Show Debug Info';
    }
}

function updateDebugInfo() {
    const debugContent = document.getElementById('debug-content');
    if (!debugContent) return;
    
    const info = {
        'User ID': window.robloxProfile ? window.robloxProfile.userId : 'Not loaded',
        'Auto Update Interval': window.robloxProfile ? `${window.robloxProfile.updateInterval / 1000}s` : 'Not loaded',
        'Is Loading': window.robloxProfile ? window.robloxProfile.isLoading : 'Not loaded',
        'Current Time': new Date().toLocaleTimeString(),
        'User Agent': navigator.userAgent.substring(0, 50) + '...',
        'Online Status': navigator.onLine ? 'Online' : 'Offline'
    };
    
    let html = '';
    for (const [key, value] of Object.entries(info)) {
        html += `<p><strong>${key}:</strong> ${value}</p>`;
    }
    
    debugContent.innerHTML = html;
}

// Initialize the Roblox profile when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Roblox profile
    window.robloxProfile = new RobloxProfile();
    
    // Handle page visibility changes to pause/resume auto-updates
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause auto-updates
            if (window.robloxProfile) {
                window.robloxProfile.stopAutoUpdate();
            }
        } else {
            // Page is visible, resume auto-updates
            if (window.robloxProfile) {
                window.robloxProfile.startAutoUpdate();
                // Also refresh data when page becomes visible again
                window.robloxProfile.refresh();
            }
        }
    });

    // Handle page unload to cleanup
    window.addEventListener('beforeunload', function() {
        if (window.robloxProfile) {
            window.robloxProfile.destroy();
        }
    });
    
    // Update debug info every 5 seconds if debug panel is visible
    setInterval(() => {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel && debugPanel.style.display !== 'none') {
            updateDebugInfo();
        }
    }, 5000);
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RobloxProfile;
}
