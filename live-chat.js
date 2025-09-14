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
        
        // Add verify badge if user is verified
        if (message.isVerified) {
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
        text.textContent = message.text;

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
            
            // New comprehensive list
            'kefe', 'b i t c h', 'f u c k', '4q', '4 q', 'fucker', 'fk', 'fak', 'bigass', 'arsehole', 'anus', 'stfu', 's t f u', 
            's y b a u', 'sybay', 'tf', 'fy', 'ahhh', 'asss', 'ufa', 'ahh', 'ah', 'cock', 'assfuck', 'asshole', 'nigger', 'nig', 
            'n i g', 'n i g g e r', 'n1gger', 'f4cker', 'f4ck', 'f@cker', 'f@cker', 'blackmen', 'wigger', 'skibidi', 
            's k i b i d i', 's k 1 b 1 d 1', 'diddy', 'igbt', '685', '6 8 5', 'damn', 'dam', 'dayum', 'd@mm', 'd@m', 
            'd@yum', 'd4mm', 'd4m', 'd4yum', 'f u', 'fu', '*'
        ];

        let filteredText = text;
        badWords.forEach(badWord => {
            const regex = new RegExp('\\b' + badWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
            filteredText = filteredText.replace(regex, '####');
        });

        return filteredText;
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
                isVerified: this.currentUser.isVerified || false
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
