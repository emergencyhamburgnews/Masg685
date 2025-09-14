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
        
        // Check if user is owner (you can customize this logic)
        const isOwner = this.currentUser.fullName === 'Masg685' || 
                       this.currentUser.displayName === 'Masg685' ||
                       this.currentUser.username === 'Masg685';
        this.currentUser.isOwner = isOwner;
        
        console.log('Current user:', this.currentUser);

        // Wait for Firebase to be available
        if (!window.firebaseApp) {
            console.log('Waiting for Firebase to load...');
            setTimeout(() => this.init(), 100);
            return;
        }

        console.log('Firebase loaded successfully');
        this.setupEventListeners();
        this.loadMessages();
        this.setupRealtimeListener();
        this.loadNoticeBanner();
        this.setupNoticeListener();
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
        } else {
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
            // Filter inappropriate words
            const filteredText = this.filterInappropriateWords(messageText);

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

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
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

    convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    scrollToBottom() {
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
                                <span class="notice-text">${data.text || 'Notice: Banner'}</span>
                            `;
                        } else {
                            noticeBanner.innerHTML = '<span>Notice: Banner</span>';
                        }
                    });
                } else {
                    noticeBanner.innerHTML = '<span>Notice: Banner</span>';
                }
            }
        } catch (error) {
            console.error('Error loading notice banner:', error);
            const noticeBanner = document.getElementById('chat-notice-banner');
            if (noticeBanner) {
                noticeBanner.innerHTML = '<span>Notice: Banner</span>';
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
                <span class="notice-text">${data.text || 'Notice: Banner'}</span>
            `;
            console.log('Updated chat notice text to:', data.text);
        } else {
            noticeBanner.innerHTML = '<span>Notice: Banner</span>';
        }
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
