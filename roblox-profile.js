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
            this.setupGameRefreshButton();
            this.loadCurrentGame();
            
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
        
        // Show error in the UI - keep text white, only show error text
        const errorElements = ['username', 'display-name', 'description', 'friend-count', 'follower-count'];
        errorElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Error loading';
                element.style.color = 'var(--text-color)'; // Keep original text color
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

        // Show error message in the update info section - only error message is red
        const lastUpdatedElement = document.getElementById('last-updated');
        if (lastUpdatedElement) {
            lastUpdatedElement.innerHTML = `<span style="color: #e74c3c;">Error: ${message}</span>`;
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

    async loadCurrentGame() {
        try {
            console.log('Loading current game data...');
            console.log('User ID:', this.userId);
            
            // Fetch current game data from Roblox API
            const gameData = await this.fetchCurrentGameData();
            
            if (gameData) {
                console.log('Game data received:', gameData);
                this.displayCurrentGame(gameData);
            } else {
                console.log('No game data received');
                this.showCurrentGameError('No game data available');
            }
            
        } catch (error) {
            console.error('Error loading current game:', error);
            this.showCurrentGameError('Failed to load game data');
        }
    }

    async fetchCurrentGameData() {
        try {
            console.log('Fetching current game data using multiple APIs...');
            
            // Try multiple CORS proxies
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];

            // First, try the presence API
            const presenceUrl = `https://presence.roblox.com/v1/presence/users`;
            
            for (const proxy of proxies) {
                try {
                    console.log(`Trying presence API proxy: ${proxy}`);
                    
                    // The presence API requires a POST request with user IDs
                    const requestBody = {
                        userIds: [parseInt(this.userId)]
                    };
                    
                    const response = await fetch(proxy + encodeURIComponent(presenceUrl), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Presence data received:', data);
                        
                        if (data.userPresences && data.userPresences.length > 0) {
                            const userPresence = data.userPresences[0];
                            console.log('Found user presence:', userPresence);
                            
                            // Check if user is currently in a game (userPresenceType 2 = InGame)
                            if (userPresence.userPresenceType === 2 && userPresence.gameId) {
                                console.log('User is currently in game:', userPresence.gameId);
                                
                                // Get game details using the game ID
                                const gameDetails = await this.fetchGameDetails(userPresence.gameId);
                                if (gameDetails) {
                                    return {
                                        name: gameDetails.name,
                                        description: gameDetails.description || '',
                                        thumbnail: gameDetails.thumbnail,
                                        players: gameDetails.players || 0,
                                        visits: gameDetails.visits || 0,
                                        created: gameDetails.created,
                                        updated: gameDetails.updated,
                                        source: 'Currently Playing'
                                    };
                                }
                            } else {
                                console.log('User is not currently in a game. Presence type:', userPresence.userPresenceType);
                                console.log('Presence types: 0=Offline, 1=Online, 2=InGame, 3=InStudio');
                            }
                        }
                    }
                } catch (proxyError) {
                    console.log(`Presence API proxy ${proxy} failed:`, proxyError);
                    continue;
                }
            }
            
            // If presence API fails, try the user activity API
            console.log('Presence API failed, trying user activity API...');
            const activityData = await this.fetchUserActivity();
            if (activityData) {
                return activityData;
            }
            
            // Try the user's recent activity to see if they're currently in a game
            console.log('Trying user recent activity...');
            const recentActivity = await this.fetchUserRecentActivity();
            if (recentActivity) {
                return recentActivity;
            }
            
            // If all else fails, try recent games as fallback
            console.log('All APIs failed, trying recent games fallback...');
            return await this.fetchRecentGamesFallback();
            
        } catch (error) {
            console.error('Error fetching current game data:', error);
            return {
                name: 'Error Loading',
                description: 'Failed to load game data',
                thumbnail: null,
                players: 0,
                visits: 0,
                created: null,
                updated: null,
                source: 'Error'
            };
        }
    }

    async fetchGameDetails(gameId) {
        try {
            console.log(`Fetching game details for game ID: ${gameId}`);
            
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];

            // Try multiple game detail endpoints
            const gameUrls = [
                `https://games.roblox.com/v1/games?universeIds=${gameId}`,
                `https://games.roblox.com/v1/games/${gameId}`,
                `https://games.roblox.com/v1/games?gameIds=${gameId}`
            ];
            
            for (const gameUrl of gameUrls) {
            for (const proxy of proxies) {
                try {
                        console.log(`Trying game details: ${gameUrl} with proxy: ${proxy}`);
                    const response = await fetch(proxy + encodeURIComponent(gameUrl));
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Game details received:', data);
                        
                            let game = null;
                        if (data.data && data.data.length > 0) {
                                game = data.data[0];
                            } else if (data.id) {
                                game = data;
                            }
                            
                            if (game) {
                                console.log('Found game details:', game);
                            
                            let thumbnailUrl = null;
                            if (game.thumbnail && game.thumbnail.mediaType === 'Image') {
                                thumbnailUrl = game.thumbnail.url;
                                } else if (game.thumbnailUrl) {
                                    thumbnailUrl = game.thumbnailUrl;
                            }
                            
                            return {
                                name: game.name,
                                description: game.description || '',
                                thumbnail: thumbnailUrl,
                                    players: game.playing || game.playerCount || 0,
                                    visits: game.visits || game.totalVisits || 0,
                                created: game.created,
                                updated: game.updated
                            };
                        }
                    }
                } catch (proxyError) {
                        console.log(`Game details proxy ${proxy} failed for ${gameUrl}:`, proxyError);
                    continue;
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching game details:', error);
            return null;
        }
    }

    async fetchUserRecentActivity() {
        try {
            console.log('Fetching user recent activity...');
            
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];

            // Try to get user's recent activity
            const activityUrl = `https://users.roblox.com/v1/users/${this.userId}/recent-activity`;
            
            for (const proxy of proxies) {
                try {
                    console.log(`Trying recent activity proxy: ${proxy}`);
                    
                    const response = await fetch(proxy + encodeURIComponent(activityUrl));
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Recent activity data received:', data);
                        
                        // Look for recent game activity
                        if (data.data && data.data.length > 0) {
                            const recentActivity = data.data[0];
                            console.log('Found recent activity:', recentActivity);
                            
                            // Check if it's a game join activity
                            if (recentActivity.type === 'GameJoin' && recentActivity.gameId) {
                                const gameDetails = await this.fetchGameDetails(recentActivity.gameId);
                                if (gameDetails) {
                                    return {
                                        name: gameDetails.name,
                                        description: gameDetails.description || '',
                                        thumbnail: gameDetails.thumbnail,
                                        players: gameDetails.players || 0,
                                        visits: gameDetails.visits || 0,
                                        created: gameDetails.created,
                                        updated: gameDetails.updated,
                                        source: 'Recently Joined'
                                    };
                                }
                            }
                        }
                    }
                } catch (proxyError) {
                    console.log(`Recent activity proxy ${proxy} failed:`, proxyError);
                    continue;
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching user recent activity:', error);
            return null;
        }
    }

    async fetchUserActivity() {
        try {
            console.log('Fetching user activity using alternative API...');
            
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];

            // Try the user activity endpoint
            const activityUrl = `https://users.roblox.com/v1/users/${this.userId}/status`;
            
            for (const proxy of proxies) {
                try {
                    console.log(`Trying user activity proxy: ${proxy}`);
                    
                    const response = await fetch(proxy + encodeURIComponent(activityUrl));
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('User activity data received:', data);
                        
                        // Check if user has a status that indicates they're in a game
                        if (data.status && data.status.includes('Playing')) {
                            // Try to extract game name from status
                            const gameName = data.status.replace('Playing ', '').replace('...', '');
                            if (gameName && gameName !== '...') {
                                return {
                                    name: gameName,
                                    description: 'Currently playing this game',
                                    thumbnail: null,
                                    players: 0,
                                    visits: 0,
                                    created: null,
                                    updated: null,
                                    source: 'Currently Playing'
                                };
                            }
                        }
                    }
                } catch (proxyError) {
                    console.log(`User activity proxy ${proxy} failed:`, proxyError);
                    continue;
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching user activity:', error);
            return null;
        }
    }

    async fetchRecentGamesFallback() {
        try {
            console.log('Fetching recent games as fallback...');
            
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://thingproxy.freeboard.io/fetch/'
            ];

            const gameUrl = `https://games.roblox.com/v1/users/5255024681/games?accessFilter=2&limit=1&sortOrder=Desc`;
            
            for (const proxy of proxies) {
                try {
                    const response = await fetch(proxy + encodeURIComponent(gameUrl));
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Recent games data received:', data);
                        
                        if (data.data && data.data.length > 0) {
                            const game = data.data[0];
                            console.log('Found recent game:', game);
                            
                            let thumbnailUrl = null;
                            if (game.thumbnail && game.thumbnail.mediaType === 'Image') {
                                thumbnailUrl = game.thumbnail.url;
                            }
                            
                            return {
                                name: game.name,
                                description: game.description || '',
                                thumbnail: thumbnailUrl,
                                players: game.playing || 0,
                                visits: game.visits || 0,
                                created: game.created,
                                updated: game.updated,
                                source: 'Recently Played'
                            };
                        }
                    }
                } catch (proxyError) {
                    console.log(`Recent games proxy ${proxy} failed:`, proxyError);
                    continue;
                }
            }
            
            return {
                name: 'No Games Found',
                description: 'No recent game activity found',
                thumbnail: null,
                players: 0,
                visits: 0,
                created: null,
                updated: null,
                source: 'No Data'
            };
            
        } catch (error) {
            console.error('Error fetching recent games fallback:', error);
            return {
                name: 'Error Loading',
                description: 'Failed to load game data',
                thumbnail: null,
                players: 0,
                visits: 0,
                created: null,
                updated: null,
                source: 'Error'
            };
        }
    }

    displayCurrentGame(gameData) {
        console.log('Displaying current game:', gameData);
        
        // Update game name
        const gameNameElement = document.getElementById('game-name');
        if (gameNameElement) {
            gameNameElement.textContent = gameData.name || 'Unknown Game';
        }

        // Update game players
        const gamePlayersElement = document.getElementById('game-players');
        if (gamePlayersElement) {
            if (gameData.players > 0) {
                const playerCount = this.formatNumber(gameData.players);
                gamePlayersElement.textContent = `${playerCount} players online`;
            } else if (gameData.visits > 0) {
                const visitCount = this.formatNumber(gameData.visits);
                gamePlayersElement.textContent = `${visitCount} total visits`;
            } else {
                gamePlayersElement.textContent = 'Game information';
            }
        }

        // Update game status based on data source
        const gameStatusElement = document.getElementById('game-status');
        if (gameStatusElement) {
            // Remove all existing status classes
            gameStatusElement.className = 'game-status';
            
            switch (gameData.source) {
                case 'Currently Playing':
                    gameStatusElement.textContent = 'Currently Playing';
                    gameStatusElement.classList.add('currently-playing');
                    break;
                case 'Recently Played':
                    gameStatusElement.textContent = 'Recently Played';
                    gameStatusElement.classList.add('recently-played');
                    break;
                case 'Favorite Games':
                    gameStatusElement.textContent = 'Favorite Game';
                    gameStatusElement.classList.add('recently-played');
                    break;
                case 'No Data':
                    gameStatusElement.textContent = 'No Recent Activity';
                    gameStatusElement.classList.add('no-activity');
                    break;
                case 'Error':
                    gameStatusElement.textContent = 'Error Loading';
                    gameStatusElement.classList.add('error');
                    break;
                default:
                    gameStatusElement.textContent = 'Game Activity';
                    gameStatusElement.classList.add('no-activity');
            }
        }

        // Update game thumbnail
        const gameThumbnailElement = document.getElementById('game-thumbnail');
        if (gameThumbnailElement) {
            if (gameData.thumbnail) {
                gameThumbnailElement.innerHTML = `
                    <img src="${gameData.thumbnail}" alt="${gameData.name}" 
                         onerror="this.parentElement.innerHTML='<div class=\\"game-loading\\">No Image</div>'">
                `;
            } else {
                gameThumbnailElement.innerHTML = '<div class="game-loading">No Image</div>';
            }
        }
    }

    showCurrentGameError(message) {
        console.error('Current game error:', message);
        
        const gameNameElement = document.getElementById('game-name');
        if (gameNameElement) {
            gameNameElement.textContent = 'Error loading game';
        }

        const gamePlayersElement = document.getElementById('game-players');
        if (gamePlayersElement) {
            gamePlayersElement.textContent = 'Error loading players';
        }

        const gameStatusElement = document.getElementById('game-status');
        if (gameStatusElement) {
            gameStatusElement.className = 'game-status error';
            gameStatusElement.textContent = 'Error loading status';
        }

        const gameThumbnailElement = document.getElementById('game-thumbnail');
        if (gameThumbnailElement) {
            gameThumbnailElement.innerHTML = '<div class="game-loading">Error loading</div>';
        }
    }

    setupRefreshButton() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadProfileData();
            });
        }
    }

    setupGameRefreshButton() {
        const gameRefreshBtn = document.getElementById('refresh-game-btn');
        if (gameRefreshBtn) {
            gameRefreshBtn.addEventListener('click', () => {
                console.log('Game refresh triggered');
                this.loadCurrentGame();
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
            this.loadCurrentGame(); // Also refresh game data
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
    
    // Add test button for game activity
    html += `<button onclick="testGameActivity()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #4a90e2; color: white; border: none; border-radius: 5px; cursor: pointer;">Test Game Activity</button>`;
    
    debugContent.innerHTML = html;
}

// Test function for game activity
async function testGameActivity() {
    console.log('Testing game activity...');
    if (window.robloxProfile) {
        try {
            const gameData = await window.robloxProfile.fetchCurrentGameData();
            console.log('Test result:', gameData);
            alert(`Game Activity Test Result:\n${JSON.stringify(gameData, null, 2)}`);
        } catch (error) {
            console.error('Test error:', error);
            alert(`Test Error: ${error.message}`);
        }
    } else {
        alert('Roblox profile not loaded');
    }
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
