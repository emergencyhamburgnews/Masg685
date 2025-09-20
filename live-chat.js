// Live Chat System with Firebase
// Firebase will be available via window.firebaseApp

class LiveChat {
    constructor() {
        this.currentUser = null;
        this.messages = [];
        this.isSubmitting = false;
        this.init();
    }

    async init() {
        // Check if user is signed up
        const userData = localStorage.getItem('chatUser');
        if (!userData) {
            // Redirect to sign up page
            window.location.href = 'chat-signup.html';
            return;
        }

        this.currentUser = JSON.parse(userData);
        
        // Check if user is verified
        const isVerified = localStorage.getItem('isVerified') === 'true';
        this.currentUser.isVerified = isVerified;
        
        // Check if user is owner (device-specific)
        // Owner status is determined by username AND device-specific verification
        const hasOwnerBadge = localStorage.getItem('isVerified') === 'true';
        const isActualOwner = this.currentUser.fullName === 'Masg685' || 
                             this.currentUser.displayName === 'Masg685' ||
                             this.currentUser.username === 'Masg685';
        
        // Only show as owner if they have the badge on THIS device AND are the actual owner
        const isOwner = isActualOwner && hasOwnerBadge;
        this.currentUser.isOwner = isOwner;
        
        // Check if user has admin privileges (device-specific)
        // Admin status requires BOTH username 'Masg685' AND admin badge on THIS device
        const hasAdminBadge = localStorage.getItem('adminCode') === '6776';
        
        // Only show as admin if they have the badge on THIS device AND are the actual owner
        const isAdmin = isActualOwner && hasAdminBadge;
        this.currentUser.isAdmin = isAdmin;
        
        console.log('Current user:', this.currentUser);

        // Wait for Firebase to be available (with timeout)
        if (!window.firebaseApp) {
            console.log('Waiting for Firebase to load...');
            // Add retry counter to prevent infinite loops
            if (!this.firebaseRetryCount) {
                this.firebaseRetryCount = 0;
            }
            this.firebaseRetryCount++;
            
            // Stop retrying after 50 attempts (5 seconds)
            if (this.firebaseRetryCount > 50) {
                console.error('Firebase failed to load after 5 seconds');
                alert('Error: Unable to connect to chat server. Please refresh the page.');
                return;
            }
            
            setTimeout(() => this.init(), 100);
            return;
        }

        console.log('Firebase loaded successfully');
        
        // Setup event listeners first (fastest)
        this.setupEventListeners();
        
        // Load messages and setup listeners in parallel
        Promise.all([
            this.loadMessages(),
            this.loadNoticeBanner()
        ]).then(() => {
            // Setup real-time listeners after initial load
            this.setupRealtimeListener();
            this.setupNoticeListener();
            this.setupAutoScroll();
        }).catch(error => {
            console.error('Error during initialization:', error);
        });
    }

    setupEventListeners() {
        // Send button
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Image button
        const imageBtn = document.getElementById('image-btn');
        const imageInput = document.getElementById('image-upload');
        if (imageBtn && imageInput) {
            imageBtn.addEventListener('click', () => {
                imageInput.click();
            });
            
            imageInput.addEventListener('change', () => {
                this.sendImage();
            });
        }

        // Video button
        const videoBtn = document.getElementById('video-btn');
        const videoInput = document.getElementById('video-upload');
        if (videoBtn && videoInput) {
            videoBtn.addEventListener('click', () => {
                videoInput.click();
            });
            
            videoInput.addEventListener('change', () => {
                this.sendVideo();
            });
        }

        // Scroll to bottom button
        const scrollBtn = document.getElementById('scroll-to-bottom-btn');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => {
                this.forceScrollToBottom();
                // Don't hide the button - let the scroll event handler manage visibility
            });
        }

        // Message input
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    async loadMessages() {
        try {
            const { db, collection, getDocs, query, orderBy, limit } = window.firebaseApp;
            const messagesSnapshot = await getDocs(
                query(collection(db, 'chatMessages'), orderBy('timestamp', 'desc'), limit(50))
            );

            this.messages = [];
            messagesSnapshot.forEach(doc => {
                this.messages.push({ id: doc.id, ...doc.data() });
            });

            // Reverse to show oldest first
            this.messages.reverse();
            this.displayMessages();

        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    setupRealtimeListener() {
        try {
            const { db, collection, query, orderBy, onSnapshot } = window.firebaseApp;
            const messagesQuery = query(collection(db, 'chatMessages'), orderBy('timestamp', 'desc'));

            onSnapshot(messagesQuery, (snapshot) => {
                const newMessages = [];
                snapshot.forEach(doc => {
                    newMessages.push({ id: doc.id, ...doc.data() });
                });

                // Check if there are new messages
                if (newMessages.length > this.messages.length) {
                    this.messages = newMessages.reverse();
                    this.displayMessages();
                    this.scrollToBottom();
                }
            });

        } catch (error) {
            console.error('Error setting up realtime listener:', error);
        }
    }

    displayMessages() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        // Hide loading indicator
        const loadingIndicator = document.getElementById('chat-loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }

        messagesContainer.innerHTML = '';

        this.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });

        this.scrollToBottom();
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        // Check if this message is from the current user by comparing usernames
        const isOwnMessage = message.username === this.currentUser.displayName || 
                           message.username === this.currentUser.fullName ||
                           message.userId === this.currentUser.id;
        messageDiv.className = `message ${isOwnMessage ? 'own-message' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.style.backgroundColor = message.avatarColor || '#6c757d';
        avatar.textContent = message.initials || 'U';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        // Create username with verify badge if user is verified
        const usernameDiv = document.createElement('div');
        usernameDiv.className = 'message-username';
        
        const usernameSpan = document.createElement('span');
        // Get the proper username from the message
        const displayName = message.username || message.userName || message.fullName || 'User';
        usernameSpan.textContent = displayName;
        usernameDiv.appendChild(usernameSpan);
        
        // Add owner badge if user is owner
        if (message.isOwner) {
            const ownerBadge = document.createElement('img');
            ownerBadge.src = 'verify.png';
            ownerBadge.alt = 'Owner';
            ownerBadge.className = 'owner-badge';
            ownerBadge.title = 'Owner';
            ownerBadge.style.width = '16px';
            ownerBadge.style.height = '16px';
            ownerBadge.style.marginLeft = '4px';
            ownerBadge.style.verticalAlign = 'middle';
            ownerBadge.style.cursor = 'help';
            ownerBadge.style.display = 'inline-block';
            
            // Add custom tooltip functionality
            let tooltip = null;
            let isTooltipVisible = false;
            
            // Function to show tooltip
            function showTooltip() {
                if (isTooltipVisible) return;
                
                tooltip = document.createElement('div');
                tooltip.className = 'owner-tooltip';
                tooltip.textContent = 'Owner';
                tooltip.style.cssText = `
                    position: fixed;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    z-index: 10000;
                    pointer-events: none;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const rect = ownerBadge.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
                tooltip.style.transform = 'translateX(-50%)';
                
                // Show tooltip
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                    isTooltipVisible = true;
                }, 10);
            }
            
            // Function to hide tooltip
            function hideTooltip() {
                if (!isTooltipVisible || !tooltip) return;
                
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                    tooltip = null;
                    isTooltipVisible = false;
                }, 300);
            }
            
            // Function to hide tooltip when clicking anywhere
            function hideTooltipOnClick(event) {
                if (isTooltipVisible && !ownerBadge.contains(event.target) && !tooltip.contains(event.target)) {
                    hideTooltip();
                }
            }
            
            // Desktop: hover events
            ownerBadge.addEventListener('mouseenter', showTooltip);
            ownerBadge.addEventListener('mouseleave', hideTooltip);
            
            // Mobile: click events
            ownerBadge.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                if (isTooltipVisible) {
                    hideTooltip();
                } else {
                    showTooltip();
                    // Add click listener to document to hide tooltip when clicking elsewhere
                    document.addEventListener('click', hideTooltipOnClick, { once: true });
                }
            });
            
            // Store cleanup function
            ownerBadge._hideTooltip = hideTooltip;
            
            usernameDiv.appendChild(ownerBadge);
        }
        // Add verify badge if user is verified (but not owner)
        else if (message.isVerified) {
            const verifyBadge = document.createElement('img');
            verifyBadge.src = 'verify.png';
            verifyBadge.alt = 'Verified';
            verifyBadge.className = 'verify-badge';
            verifyBadge.style.width = '16px';
            verifyBadge.style.height = '16px';
            verifyBadge.style.marginLeft = '4px';
            verifyBadge.style.verticalAlign = 'middle';
            usernameDiv.appendChild(verifyBadge);
        }

        const text = document.createElement('div');
        text.className = 'message-text';
        
        // Handle image messages
        if (message.isImage && message.imageUrl) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'message-image-container';
            
            const image = document.createElement('img');
            image.src = message.imageUrl;
            image.alt = message.imageName || 'Image';
            image.className = 'message-image';
            image.style.maxWidth = '200px';
            image.style.maxHeight = '200px';
            image.style.borderRadius = '8px';
            image.style.cursor = 'pointer';
            
            // Add click to view full size
            image.addEventListener('click', () => {
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '10000';
                modal.style.cursor = 'pointer';
                
                const fullImage = document.createElement('img');
                fullImage.src = message.imageUrl;
                fullImage.style.maxWidth = '90%';
                fullImage.style.maxHeight = '90%';
                fullImage.style.borderRadius = '8px';
                
                modal.appendChild(fullImage);
                document.body.appendChild(modal);
                
                modal.addEventListener('click', () => {
                    document.body.removeChild(modal);
                });
            });
            
            imageContainer.appendChild(image);
            text.appendChild(imageContainer);
        } 
        // Handle video messages
        else if (message.videoUrl) {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'message-video-container';
            
            const video = document.createElement('video');
            video.src = message.videoUrl;
            video.controls = true;
            video.className = 'message-video';
            video.style.maxWidth = '300px';
            video.style.maxHeight = '200px';
            video.style.borderRadius = '8px';
            video.style.cursor = 'pointer';
            
            // Add video duration display
            if (message.videoDuration) {
                const durationSpan = document.createElement('span');
                durationSpan.textContent = `Duration: ${Math.round(message.videoDuration)}s`;
                durationSpan.style.display = 'block';
                durationSpan.style.fontSize = '12px';
                durationSpan.style.color = '#666';
                durationSpan.style.marginTop = '4px';
                videoContainer.appendChild(durationSpan);
            }
            
            videoContainer.appendChild(video);
            text.appendChild(videoContainer);
        } 
        else {
            text.textContent = message.text;
        }

        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = this.formatTime(message.timestamp);

        bubble.appendChild(usernameDiv);
        bubble.appendChild(text);
        bubble.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);

        return messageDiv;
    }

    formatTime(timestamp) {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    filterInappropriateWords(text) {
        const badWords = [
            // Original words
            'fuck', 'shit', 'damn', 'bitch', 'asshole', 'stupid', 'idiot', 'hate', 'kill', 'die', 'crap', 'hell', 'wtf', 'omg',
            'fucking', 'shitty', 'damned', 'bitchy', 'ass', 'dumb', 'moron', 'retard', 'gay', 'lesbian', 'nigger', 'nigga',
            'faggot', 'whore', 'slut', 'porn', 'sex', 'pornography', 'xxx', 'adult', 'nude', 'naked', 'bastard', 'cunt',
            'cock', 'dick', 'penis', 'vagina', 'boobs', 'tits', 'breast', 'pussy', 'butt', 'arse', 'fart', 'poop', 'pee',
            'piss', 'urine', 'feces', 'bullshit', 'horseshit', 'cowshit', 'dogshit', 'ratshit', 'pissed', 'fuck off',
            'fuck you', 'fuck this', 'fuck that', 'fuck up', 'fucked up', 'fucking hell', 'holy shit', 'what the fuck',
            'oh my god', 'jesus christ', 'goddamn', 'bloody hell', 'son of a bitch', 'piece of shit', 'you suck',
            'you are stupid', 'you are dumb', 'you are an idiot', 'kill yourself', 'go die', 'screw you', 'damn it',
            
            // New comprehensive list (removed duplicate f@cker)
            'kefe', 'b i t c h', 'f u c k', '4q', '4 q', 'fucker', 'fk', 'fak', 'bigass', 'arsehole', 'anus', 'stfu', 's t f u', 
            's y b a u', 'sybay', 'tf', 'fy', 'ahhh', 'asss', 'ufa', 'ahh', 'ah', 'cock', 'assfuck', 'asshole', 'nigger', 'nig', 
            'n i g', 'n i g g e r', 'n1gger', 'f4cker', 'f4ck', 'f@cker', 'F@ck', 'blackmen', 'wigger', 'skibidi', 
            's k i b i d i', 's k 1 b 1 d 1', 'diddy', 'igbt', '685', '6 8 5', 'damn', 'dam', 'dayum', 'd@mm', 'd@m', 
            'd@yum', 'd4mm', 'd4m', 'd4yum', 'f u', 'fu', '*'
        ];

        let filteredText = text;
        badWords.forEach(badWord => {
            // Create replacement with correct number of # symbols based on word length
            const replacement = '#'.repeat(badWord.length);
            
            // Handle special characters and spaces in the word
            let regexPattern;
            if (badWord.includes(' ')) {
                // For words with spaces, use word boundaries around the whole phrase
                regexPattern = '\\b' + badWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b';
            } else {
                // For single words, use word boundaries
                regexPattern = '\\b' + badWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b';
            }
            
            const regex = new RegExp(regexPattern, 'gi');
            filteredText = filteredText.replace(regex, replacement);
        });

        return filteredText;
    }

    replaceLinksWithTags(text) {
        // Common link patterns to replace with ####### tags
        const linkPatterns = [
            // HTTP/HTTPS URLs
            { pattern: /https?:\/\/[^\s]+/gi, replacement: '#######' },
            // www. links
            { pattern: /www\.[^\s]+/gi, replacement: '#######' },
            // Social media platforms
            { pattern: /(?:tiktok\.com|youtube\.com|youtu\.be|instagram\.com|facebook\.com|twitter\.com|x\.com|discord\.gg|discord\.com|twitch\.tv|reddit\.com|snapchat\.com|linkedin\.com|pinterest\.com|telegram\.me|whatsapp\.com|messenger\.com|skype\.com|zoom\.us|teams\.microsoft\.com)/gi, replacement: '#######' },
            // Gaming platforms
            { pattern: /(?:steamcommunity\.com|steam\.com|roblox\.com|minecraft\.net|epicgames\.com|origin\.com|battle\.net|playstation\.com|xbox\.com|nintendo\.com|ea\.com|ubisoft\.com|activision\.com|blizzard\.com)/gi, replacement: '#######' },
            // File sharing and cloud
            { pattern: /(?:drive\.google\.com|dropbox\.com|onedrive\.com|mega\.nz|mediafire\.com|wetransfer\.com|sendspace\.com)/gi, replacement: '#######' },
            // Other common domains
            { pattern: /(?:amazon\.com|ebay\.com|paypal\.com|stripe\.com|github\.com|stackoverflow\.com|wikipedia\.org|google\.com|bing\.com|yahoo\.com)/gi, replacement: '#######' },
            // Shortened URLs
            { pattern: /(?:bit\.ly|tinyurl\.com|short\.link|t\.co|goo\.gl|ow\.ly|is\.gd|v\.gd|buff\.ly|rebrand\.ly)/gi, replacement: '#######' },
            // Email addresses
            { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, replacement: '#######' },
            // IP addresses
            { pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/gi, replacement: '#######' },
            // Domain patterns without protocol
            { pattern: /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/gi, replacement: '#######' }
        ];
        
        let filteredText = text;
        
        // Replace each pattern with ####### tags
        linkPatterns.forEach(({ pattern, replacement }) => {
            filteredText = filteredText.replace(pattern, replacement);
        });
        
        return filteredText;
    }

    // Test function to verify filtering works correctly (can be removed in production)
    testWordFiltering() {
        const testCases = [
            { input: 'f@cker', expected: '######' },
            { input: 'F@ck', expected: '####' },
            { input: 'fuck', expected: '####' },
            { input: 'fucking hell', expected: '####### ####' },
            { input: 'damn', expected: '####' },
            { input: 'skibidi', expected: '#######' },
            { input: 'f u c k', expected: '#######' }
        ];

        console.log('Testing word filtering:');
        testCases.forEach(test => {
            const result = this.filterInappropriateWords(test.input);
            console.log(`Input: "${test.input}" -> Output: "${result}" (Expected: "${test.expected}")`);
        });
    }

    async sendMessage() {
        if (this.isSubmitting) return;

        const messageInput = document.getElementById('message-input');
        const messageText = messageInput.value.trim();

        if (!messageText) return;

        this.isSubmitting = true;

        try {
            // Filter inappropriate words first
            let filteredText = this.filterInappropriateWords(messageText);
            
            // Replace external links with ####### tags
            filteredText = this.replaceLinksWithTags(filteredText);

            const { db, collection, addDoc } = window.firebaseApp;
            const messageData = {
                text: filteredText,
                userId: this.currentUser.id,
                userName: this.currentUser.fullName,
                username: this.currentUser.displayName || this.currentUser.fullName, // Use displayName for chat
                fullName: this.currentUser.fullName,
                initials: this.currentUser.initials,
                avatarColor: this.currentUser.avatarColor,
                timestamp: new Date(),
                isActive: true,
                isVerified: this.currentUser.isVerified || false,
                isOwner: this.currentUser.isOwner || false
            };

            await addDoc(collection(db, 'chatMessages'), messageData);
            console.log('Message sent successfully');

            // Clear input
            messageInput.value = '';

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            this.isSubmitting = false;
        }
    }

    async sendImage() {
        if (this.isSubmitting) return;

        const imageInput = document.getElementById('image-upload');
        const file = imageInput.files[0];

        if (!file) return;

        // No file size limit for images - allow any size
        console.log('Image file size:', (file.size / (1024 * 1024)).toFixed(2), 'MB');

        // Check file type - support all image formats (case insensitive)
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
        const fileType = file.type.toLowerCase();
        const isImageType = allowedImageTypes.includes(fileType) || fileType.startsWith('image/');
        
        if (!isImageType) {
            alert('Please select a valid image file (JPG, PNG, GIF, WebP, BMP, SVG)');
            return;
        }

        this.isSubmitting = true;

        try {
            // Convert image to base64
            const base64 = await this.convertToBase64(file);
            
            const { db, collection, addDoc } = window.firebaseApp;
            const messageData = {
                text: '[Image]',
                imageUrl: base64,
                imageName: file.name,
                userId: this.currentUser.id,
                userName: this.currentUser.fullName,
                username: this.currentUser.displayName || this.currentUser.fullName,
                fullName: this.currentUser.fullName,
                initials: this.currentUser.initials,
                avatarColor: this.currentUser.avatarColor,
                timestamp: new Date(),
                isActive: true,
                isVerified: this.currentUser.isVerified || false,
                isOwner: this.currentUser.isOwner || false,
                isImage: true
            };

            await addDoc(collection(db, 'chatMessages'), messageData);
            console.log('Image sent successfully');

            // Clear file input
            imageInput.value = '';

        } catch (error) {
            console.error('Error sending image:', error);
            alert('Error sending image. Please try again.');
        } finally {
            this.isSubmitting = false;
        }
    }

    async sendVideo() {
        if (this.isSubmitting) return;

        const videoInput = document.getElementById('video-upload');
        const file = videoInput.files[0];

        if (!file) return;

        // No file size limit for videos - allow any size
        console.log('Video file size:', (file.size / (1024 * 1024)).toFixed(2), 'MB');

        // Check file type (case insensitive)
        const fileType = file.type.toLowerCase();
        if (!fileType.startsWith('video/')) {
            alert('Please select a valid video file');
            return;
        }

        // Check video duration (1 second minimum, 1 min 50s maximum = 110 seconds)
        try {
            const duration = await this.getVideoDuration(file);
            console.log('Video duration:', duration, 'seconds');
            
            if (duration < 1) {
                alert('Video must be at least 1 second long');
                return;
            }
            
            if (duration > 110) {
                alert('Video must be 1 minute 50 seconds or less');
                return;
            }
        } catch (error) {
            console.error('Error checking video duration:', error);
            alert('Error checking video duration. Please try again.');
            return;
        }

        this.isSubmitting = true;

        try {
            console.log('Starting video upload process...');
            console.log('File size:', file.size, 'bytes');
            console.log('File type:', file.type);
            
            // Convert video to base64
            console.log('Converting video to base64...');
            const base64 = await this.convertToBase64(file);
            console.log('Base64 conversion completed, length:', base64.length);
            
            // Get video duration
            const duration = await this.getVideoDuration(file);
            console.log('Video duration:', duration, 'seconds');
            
            const { db, collection, addDoc } = window.firebaseApp;
            const messageData = {
                text: '[Video]',
                videoUrl: base64,
                videoDuration: duration,
                userId: this.currentUser.id,
                userName: this.currentUser.fullName,
                username: this.currentUser.displayName || this.currentUser.fullName,
                fullName: this.currentUser.fullName,
                initials: this.currentUser.initials,
                avatarColor: this.currentUser.avatarColor,
                timestamp: new Date(),
                isActive: true,
                isVerified: this.currentUser.isVerified || false,
                isOwner: this.currentUser.isOwner || false
            };

            console.log('Sending video to Firebase...');
            await addDoc(collection(db, 'chatMessages'), messageData);
            console.log('Video sent successfully!');
            
            // Clear the input
            videoInput.value = '';
            
            // Scroll to bottom
            this.scrollToBottom();
            
        } catch (error) {
            console.error('Error sending video:', error);
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
            
            // More specific error messages
            if (error.message.includes('quota') || error.message.includes('size')) {
                alert('Video file is too large for Firebase. Please try a smaller video or check your Firebase quota.');
            } else if (error.message.includes('permission')) {
                alert('Permission denied. Please check your account permissions.');
            } else if (error.message.includes('network')) {
                alert('Network error. Please check your internet connection and try again.');
            } else if (error.message.includes('timeout')) {
                alert('Upload timeout. The video file might be too large. Please try a smaller video.');
            } else {
                alert('Error sending video. Please try again. Error: ' + error.message);
            }
        } finally {
            this.isSubmitting = false;
        }
    }

    getVideoDuration(file) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            
            video.onerror = () => {
                window.URL.revokeObjectURL(video.src);
                reject(new Error('Error loading video metadata'));
            };
            
            video.src = URL.createObjectURL(file);
        });
    }

    convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                console.log('Base64 conversion successful');
                resolve(reader.result);
            };
            
            reader.onerror = (error) => {
                console.error('Base64 conversion failed:', error);
                reject(new Error('Failed to convert video to base64: ' + error.message));
            };
            
            reader.onabort = () => {
                console.error('Base64 conversion aborted');
                reject(new Error('Video conversion was aborted'));
            };
            
            try {
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error starting base64 conversion:', error);
                reject(new Error('Failed to start video conversion: ' + error.message));
            }
        });
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    forceScrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async loadNoticeBanner() {
        try {
            // Use the same notice system as other pages - use 'notice' collection (not 'notices')
            const { db, collection, getDocs } = window.firebaseApp;
            const noticeSnapshot = await getDocs(collection(db, 'notice'));

            const noticeBanner = document.getElementById('chat-notice-banner');
            if (noticeBanner) {
                if (!noticeSnapshot.empty) {
                    noticeSnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.enabled) {
                            noticeBanner.innerHTML = `
                                <span class="notice-icon">${data.icon || '⚠️'}</span>
                                <span class="notice-text">${data.text || 'Loading...'}</span>
                            `;
                        } else {
                            noticeBanner.innerHTML = '<span>Loading...</span>';
                        }
                    });
                } else {
                    noticeBanner.innerHTML = '<span>Loading...</span>';
                }
            }
        } catch (error) {
            console.error('Error loading notice banner:', error);
            const noticeBanner = document.getElementById('chat-notice-banner');
            if (noticeBanner) {
                noticeBanner.innerHTML = '<span>Loading...</span>';
            }
        }
    }

    setupNoticeListener() {
        try {
            const { db, collection, onSnapshot } = window.firebaseApp;
            
            // Listen for notice changes in notice collection (same as other pages)
            onSnapshot(collection(db, 'notice'), (snapshot) => {
                console.log('Real-time notice update received in chat');
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    this.updateNoticeBanner(data);
                });
            });
            
            console.log('Notice listener set up for chat');
        } catch (error) {
            console.error('Error setting up notice listener:', error);
        }
    }

    updateNoticeBanner(data) {
        console.log('Updating chat notice banner with:', data);
        
        const noticeBanner = document.getElementById('chat-notice-banner');
        if (!noticeBanner) {
            console.log('Chat notice banner not found');
            return;
        }
        
        if (data.enabled) {
            noticeBanner.innerHTML = `
                <span class="notice-icon">${data.icon || '⚠️'}</span>
                <span class="notice-text">${data.text || 'Loading...'}</span>
            `;
            console.log('Updated chat notice text to:', data.text);
        } else {
            noticeBanner.innerHTML = '<span>Loading...</span>';
        }
    }

    setupAutoScroll() {
        const messagesContainer = document.getElementById('chat-messages');
        const scrollBtn = document.getElementById('scroll-to-bottom-btn');
        
        if (!messagesContainer || !scrollBtn) return;

        // Show/hide scroll button based on scroll position
        messagesContainer.addEventListener('scroll', () => {
            const isAtBottom = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 100;
            
            if (isAtBottom) {
                scrollBtn.style.display = 'none';
            } else {
                scrollBtn.style.display = 'flex';
            }
        });

        // Store original scrollToBottom for auto-scroll behavior
        this.originalScrollToBottom = this.scrollToBottom.bind(this);
        
        // Override scrollToBottom for auto-scroll behavior (only when new messages arrive)
        this.scrollToBottom = () => {
            const isNearBottom = messagesContainer.scrollTop + messagesContainer.clientHeight >= messagesContainer.scrollHeight - 200;
            
            if (isNearBottom) {
                this.originalScrollToBottom();
            }
        };
    }
}

// Global functions
function goBack() {
    const previousPage = localStorage.getItem('previousPage');
    console.log('Live chat go back - Previous page:', previousPage);
    
    // If we have a previous page and it's not a chat/signup page, go there
    if (previousPage && !previousPage.includes('live-chat.html') && !previousPage.includes('chat-signup.html')) {
        console.log('Going back to normal page:', previousPage);
        window.location.href = previousPage;
    } else {
        console.log('Using browser back');
        window.history.back();
    }
}

function editProfile() {
    // DON'T overwrite previous page - keep the original page that brought us to chat
    // Just redirect to sign up page to edit profile
    window.location.href = 'chat-signup.html';
}

function showChatInfo() {
    alert('Live Chat - Connect with other users in real-time!');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.liveChat = new LiveChat();
});
