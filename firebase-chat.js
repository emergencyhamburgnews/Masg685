// Firebase Chat System Integration
// This file handles Firebase operations for the live chat system

class FirebaseChat {
    constructor() {
        this.db = null;
        this.auth = null;
        this.provider = null;
        this.init();
    }

    async init() {
        // Wait for Firebase to be available
        if (!window.firebaseApp) {
            console.log('Waiting for Firebase to load...');
            setTimeout(() => this.init(), 100);
            return;
        }

        this.db = window.firebaseApp.db;
        this.auth = window.firebaseApp.auth;
        this.provider = window.firebaseApp.provider;
        
        console.log('Firebase Chat initialized successfully');
    }

    // Save user profile to Firebase
    async saveUserProfile(userData) {
        try {
            const { collection, addDoc } = window.firebaseApp;
            const docRef = await addDoc(collection(this.db, 'chatUsers'), userData);
            console.log('User profile saved:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error saving user profile:', error);
            throw error;
        }
    }

    // Check if username exists
    async checkUsernameExists(username) {
        try {
            const { collection, getDocs, query, where } = window.firebaseApp;
            const usersSnapshot = await getDocs(
                query(collection(this.db, 'chatUsers'), where('username', '==', username))
            );
            return !usersSnapshot.empty;
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    }

    // Save message to Firebase
    async saveMessage(messageData) {
        try {
            const { collection, addDoc } = window.firebaseApp;
            const docRef = await addDoc(collection(this.db, 'chatMessages'), messageData);
            console.log('Message saved:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    }

    // Load messages from Firebase
    async loadMessages(limit = 50) {
        try {
            const { collection, getDocs, query, orderBy, limit: limitFn } = window.firebaseApp;
            const messagesSnapshot = await getDocs(
                query(collection(this.db, 'chatMessages'), orderBy('timestamp', 'desc'), limitFn(limit))
            );

            const messages = [];
            messagesSnapshot.forEach(doc => {
                messages.push({ id: doc.id, ...doc.data() });
            });

            return messages.reverse(); // Return oldest first
        } catch (error) {
            console.error('Error loading messages:', error);
            return [];
        }
    }

    // Set up real-time listener for messages
    setupMessageListener(callback) {
        try {
            const { collection, query, orderBy, onSnapshot } = window.firebaseApp;
            const messagesQuery = query(collection(this.db, 'chatMessages'), orderBy('timestamp', 'desc'));

            return onSnapshot(messagesQuery, (snapshot) => {
                const messages = [];
                snapshot.forEach(doc => {
                    messages.push({ id: doc.id, ...doc.data() });
                });
                callback(messages.reverse());
            });
        } catch (error) {
            console.error('Error setting up message listener:', error);
            return null;
        }
    }

    // Get user profile by ID
    async getUserProfile(userId) {
        try {
            const { collection, getDocs, query, where } = window.firebaseApp;
            const usersSnapshot = await getDocs(
                query(collection(this.db, 'chatUsers'), where('__name__', '==', userId))
            );

            if (!usersSnapshot.empty) {
                const doc = usersSnapshot.docs[0];
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }

    // Update user profile
    async updateUserProfile(userId, updateData) {
        try {
            const { doc, updateDoc } = window.firebaseApp;
            await updateDoc(doc(this.db, 'chatUsers', userId), updateData);
            console.log('User profile updated:', userId);
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // Delete message (for moderation)
    async deleteMessage(messageId) {
        try {
            const { doc, deleteDoc } = window.firebaseApp;
            await deleteDoc(doc(this.db, 'chatMessages', messageId));
            console.log('Message deleted:', messageId);
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    // Get all users (for admin purposes)
    async getAllUsers() {
        try {
            const { collection, getDocs } = window.firebaseApp;
            const usersSnapshot = await getDocs(collection(this.db, 'chatUsers'));
            
            const users = [];
            usersSnapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
            
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            return [];
        }
    }

    // Get message statistics
    async getMessageStats() {
        try {
            const { collection, getDocs } = window.firebaseApp;
            const messagesSnapshot = await getDocs(collection(this.db, 'chatMessages'));
            const usersSnapshot = await getDocs(collection(this.db, 'chatUsers'));
            
            return {
                totalMessages: messagesSnapshot.size,
                totalUsers: usersSnapshot.size
            };
        } catch (error) {
            console.error('Error getting message stats:', error);
            return { totalMessages: 0, totalUsers: 0 };
        }
    }
}

// Initialize Firebase Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.firebaseChat = new FirebaseChat();
});
