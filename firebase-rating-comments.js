// Simple Rating and Comment System with Firebase Storage
// Firebase will be available via window.firebaseApp

class RatingCommentSystem {
    constructor() {
        this.userRating = 0;
        this.comments = [];
        this.showingAllComments = false;
        this.totalRating = 0;
        this.ratingCount = 0;
        
        this.init();
    }

    async init() {
        // Wait for Firebase to be available
        if (!window.firebaseApp) {
            console.log('Waiting for Firebase to load...');
            setTimeout(() => this.init(), 100);
            return;
        }

        console.log('Firebase loaded successfully');

        // Load initial data
        try {
            await this.loadRatingData();
            await this.loadComments();
            
            // Set up real-time listeners
            this.setupRealtimeListeners();
            
            // Check for auto-reset
            this.checkAutoReset();
            
            // Load user's rating if they already rated
            this.loadUserRating();
            
            console.log('Firebase system initialized successfully');
        } catch (error) {
            console.error('Error initializing Firebase system:', error);
        }
    }

    // Rating system methods
    async loadRatingData() {
        try {
            const { db, collection, getDocs } = window.firebaseApp;
            const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
            
            let totalRating = 0;
            let ratingCount = 0;

            ratingsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.rating) {
                    totalRating += data.rating;
                    ratingCount += 1;
                }
            });

            this.totalRating = totalRating;
            this.ratingCount = ratingCount;
            this.updateRatingDisplay(totalRating, ratingCount);
        } catch (error) {
            console.error('Error loading rating data:', error);
        }
    }

    async submitRating(rating) {
        // Check if user already rated
        const hasRated = localStorage.getItem('userHasRated');
        if (hasRated) {
            this.showMessage('You have already rated! You can only rate once.', 'error');
            return;
        }

        // Update local display immediately (always works)
        this.totalRating += rating;
        this.ratingCount += 1;
        this.updateRatingDisplay(this.totalRating, this.ratingCount);
        this.showUserRating(rating);
        
        // Mark user as having rated and store their rating
        localStorage.setItem('userHasRated', 'true');
        localStorage.setItem('userRating', rating.toString());
        
        // Try to save to Firebase (optional)
        try {
            const { db, collection, addDoc } = window.firebaseApp;
            await addDoc(collection(db, 'ratings'), {
                rating: rating,
                timestamp: new Date()
            });
            console.log('Rating saved to Firebase successfully!');
        } catch (error) {
            console.error('Firebase save failed, but rating still works locally:', error);
            // Rating still works locally even if Firebase fails
        }
    }

    updateRatingDisplay(totalRating, ratingCount) {
        const averageRating = ratingCount > 0 ? (totalRating / ratingCount) : 0;
        const percentage = Math.round((averageRating / 5) * 100);
        
        document.getElementById('average-rating').textContent = `Average: ${percentage}% (${ratingCount} vote${ratingCount !== 1 ? 's' : ''})`;
        document.getElementById('rating-message').textContent = ratingCount > 0 ? 'Thank you for rating!' : 'Click a star to rate!';
    }

    updateStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Show user's personal rating
    showUserRating(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('user-rated');
                star.classList.add('active');
            } else {
                star.classList.remove('user-rated');
                star.classList.remove('active');
            }
        });
    }

    // Load user's rating from localStorage
    loadUserRating() {
        const userRating = localStorage.getItem('userRating');
        if (userRating) {
            const rating = parseInt(userRating);
            this.showUserRating(rating);
            console.log('Loaded user rating:', rating);
        }
    }

    setupRealtimeListeners() {
        const { db, onSnapshot, collection, query, orderBy } = window.firebaseApp;
        
        // Real-time rating updates
        const ratingsQuery = query(collection(db, 'ratings'));
        onSnapshot(ratingsQuery, (snapshot) => {
            let totalRating = 0;
            let ratingCount = 0;
            
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.rating) {
                    totalRating += data.rating;
                    ratingCount += 1;
                }
            });
            
            this.totalRating = totalRating;
            this.ratingCount = ratingCount;
            this.updateRatingDisplay(totalRating, ratingCount);
        });

        // Real-time comment updates
        const commentsQuery = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
        onSnapshot(commentsQuery, (snapshot) => {
            // Store local comments before clearing
            const localComments = this.comments.filter(comment => comment.id.startsWith('local_'));
            
            this.comments = [];
            snapshot.forEach(doc => {
                this.comments.push({ id: doc.id, ...doc.data() });
            });
            
            // Re-add local comments that haven't been synced yet
            localComments.forEach(localComment => {
                const existsInFirebase = this.comments.some(comment => 
                    comment.text === localComment.text && 
                    comment.author === localComment.author &&
                    Math.abs(new Date(comment.timestamp) - new Date(localComment.timestamp)) < 5000 // Within 5 seconds
                );
                if (!existsInFirebase) {
                    this.comments.unshift(localComment);
                }
            });
            
            this.displayComments();
        });
    }

    // Comment system methods
    async loadComments() {
        try {
            const { db, collection, query, orderBy, getDocs } = window.firebaseApp;
            const commentsQuery = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(commentsQuery);
            
            this.comments = [];
            snapshot.forEach(doc => {
                this.comments.push({ id: doc.id, ...doc.data() });
            });
            
            this.displayComments();
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    }

    async submitComment(commentText) {
        console.log('submitComment called with:', commentText);
        
        // Prevent duplicate submissions
        if (this.isSubmitting) {
            console.log('Already submitting, ignoring duplicate call');
            return;
        }
        
        this.isSubmitting = true;
        
        if (!commentText || !commentText.trim()) {
            this.showMessage('Please enter a comment!', 'error');
            this.isSubmitting = false;
            return;
        }

        // Check if user already commented
        const hasCommented = localStorage.getItem('userHasCommented');
        if (hasCommented) {
            this.showMessage('You have already commented! You can only comment once.', 'error');
            this.isSubmitting = false;
            return;
        }

        // Check for bad words with improved filtering
        const badWords = [
            // Basic bad words
            'fuck', 'shit', 'damn', 'bitch', 'asshole', 'stupid', 'idiot', 'hate', 'kill', 'die', 'crap', 'hell', 'wtf', 'omg', 'fucking', 'shitty', 'damned', 'bitchy', 'ass', 'dumb', 'moron', 'retard', 'gay', 'lesbian', 'nigger', 'nigga', 'faggot', 'whore', 'slut', 'porn', 'sex', 'pornography', 'xxx', 'adult', 'nude', 'naked',
            // More bad words
            'bastard', 'cunt', 'cock', 'dick', 'penis', 'vagina', 'boobs', 'tits', 'breast', 'pussy', 'ass', 'butt', 'arse', 'fart', 'poop', 'pee', 'piss', 'urine', 'feces', 'crap', 'bullshit', 'horseshit', 'cowshit', 'dogshit', 'ratshit', 'pissed', 'pissed off', 'piss off', 'fuck off', 'fuck you', 'fuck this', 'fuck that', 'fuck up', 'fuck up', 'fucked up', 'fucking hell', 'holy shit', 'what the fuck', 'oh my god', 'jesus christ', 'goddamn', 'bloody hell', 'son of a bitch', 'piece of shit', 'you suck', 'you are stupid', 'you are dumb', 'you are an idiot', 'kill yourself', 'go die', 'fuck this', 'fuck that', 'bullshit', 'this is shit', 'that is shit', 'so stupid', 'so dumb', 'so annoying', 'hate this', 'hate you', 'fuck up', 'screw you', 'damn it', 'shit happens', 'fucking awesome', 'fucking great', 'fucking bad', 'fucking good', 'fucking stupid', 'fucking idiot', 'fucking moron', 'fucking retarded', 'fucking gay', 'fucking lesbian', 'fucking nigger', 'fucking nigga', 'fucking faggot', 'fucking whore', 'fucking slut', 'fucking porn', 'fucking sex', 'fucking adult', 'fucking nude', 'fucking naked',
            // Variations with spaces
            'f u c k', 's h i t', 'd a m n', 'b i t c h', 'a s s h o l e', 's t u p i d', 'i d i o t', 'h a t e', 'k i l l', 'd i e', 'c r a p', 'h e l l', 'w t f', 'o m g', 'f u c k i n g', 's h i t t y', 'd a m n e d', 'b i t c h y', 'a s s', 'd u m b', 'm o r o n', 'r e t a r d', 'g a y', 'l e s b i a n', 'n i g g e r', 'n i g g a', 'f a g g o t', 'w h o r e', 's l u t', 'p o r n', 's e x', 'p o r n o g r a p h y', 'x x x', 'a d u l t', 'n u d e', 'n a k e d',
            // Variations with special characters
            'f@ck', 'sh!t', 'd@mn', 'b!tch', 'a$$hole', 'st*pid', '!d!ot', 'h@te', 'k!ll', 'd!e', 'cr@p', 'h3ll', 'wtf', '0mg', 'f*cking', 'sh!tty', 'd@mned', 'b!tchy', 'a$$', 'd*mb', 'm0r0n', 'r3t@rd', 'g@y', 'l3sb!@n', 'n!gg3r', 'n!gg@', 'f@gg0t', 'wh0r3', 'sl*t', 'p0rn', 's3x', 'p0rn0gr@phy', 'xxx', '4dult', 'nud3', 'n@k3d'
        ];
        
        // More precise word boundary checking to avoid false positives
        const commentLower = commentText.toLowerCase();
        
        for (let badWord of badWords) {
            // Use word boundary regex to avoid partial matches
            const regex = new RegExp('\\b' + badWord.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
            if (regex.test(commentLower)) {
                this.showMessage('Please keep your comment appropriate and respectful!', 'error');
                this.isSubmitting = false;
                return;
            }
            
            // Also check for exact matches (for words with spaces)
            if (commentLower.includes(badWord.toLowerCase())) {
                this.showMessage('Please keep your comment appropriate and respectful!', 'error');
                this.isSubmitting = false;
                return;
            }
        }

        console.log('Adding comment locally...');
        
        // Generate a random color for the avatar
        const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'];
        const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
        
        // Add comment locally immediately
        const newComment = {
            id: 'local_' + Date.now(),
            text: commentText.trim(),
            author: 'Guest User',
            timestamp: new Date(),
            avatarColor: randomColor
        };
        
        // Clear the input field first
        const commentInput = document.getElementById('comment-input');
        if (commentInput) {
            commentInput.value = '';
        }
        
        // Mark user as having commented
        localStorage.setItem('userHasCommented', 'true');
        
        // Try to save to Firebase first
        try {
            const { db, collection, addDoc } = window.firebaseApp;
            await addDoc(collection(db, 'comments'), {
                text: commentText.trim(),
                author: 'Guest User',
                timestamp: new Date(),
                avatarColor: randomColor
            });
            console.log('Comment saved to Firebase successfully!');
            this.showMessage('Comment added successfully!', 'success');
        } catch (error) {
            console.error('Firebase save failed, falling back to local storage:', error);
            // Fallback: add to local array and display if Firebase fails
            this.comments.unshift(newComment);
            this.displayComments();
            this.showMessage('Comment added successfully! (Local only)', 'success');
        }
        
        // Reset the submitting flag with a small delay to prevent rapid successive calls
        setTimeout(() => {
            this.isSubmitting = false;
            console.log('Comment submission completed, isSubmitting reset to false');
        }, 100);
    }

    displayComments() {
        console.log('displayComments called, total comments:', this.comments.length);
        const commentsContainer = document.getElementById('comments-container');
        
        if (!commentsContainer) {
            console.error('Comments container not found!');
            return;
        }
        
        const commentsToShow = this.showingAllComments ? this.comments : this.comments.slice(0, 5);
        console.log('Comments to show:', commentsToShow.length);
        
        commentsContainer.innerHTML = '';
        
        if (commentsToShow.length === 0) {
            commentsContainer.innerHTML = '<p style="text-align: center; color: var(--text-color); opacity: 0.7;">No comments yet. Be the first to comment!</p>';
            console.log('No comments to display, showing default message');
            return;
        }

        commentsToShow.forEach((comment, index) => {
            console.log(`Creating comment ${index + 1}:`, comment);
            
            // Use the comment's avatar color or generate a random one
            const avatarColor = comment.avatarColor || this.getRandomAvatarColor();
            
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <div class="comment-avatar" style="background-color: ${avatarColor}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">
                        ${comment.author.charAt(0)}
                    </div>
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-time">${this.formatTime(comment.timestamp)}</div>
                </div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsContainer.appendChild(commentElement);
        });

        console.log('Comments displayed successfully');
        // Update "See More" button
        this.updateSeeMoreButton();
    }

    updateSeeMoreButton() {
        const seeMoreBtn = document.getElementById('see-more-btn');
        if (this.comments.length > 5) {
            seeMoreBtn.style.display = 'block';
            seeMoreBtn.textContent = this.showingAllComments ? 'Show Less' : `See More (${this.comments.length - 5} more)`;
        } else {
            seeMoreBtn.style.display = 'none';
        }
    }

    toggleSeeMore() {
        this.showingAllComments = !this.showingAllComments;
        this.displayComments();
    }

    formatTime(timestamp) {
        const now = new Date();
        let commentTime;
        
        // Handle both Firebase timestamps and regular Date objects
        if (timestamp && typeof timestamp.toDate === 'function') {
            // Firebase timestamp
            commentTime = timestamp.toDate();
        } else if (timestamp instanceof Date) {
            // Regular Date object
            commentTime = timestamp;
        } else {
            // Fallback
            commentTime = new Date(timestamp);
        }
        
        const diffInSeconds = Math.floor((now - commentTime) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    getRandomAvatarColor() {
        const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'];
        return avatarColors[Math.floor(Math.random() * avatarColors.length)];
    }

    // Function to reset everything (ratings and comments)
    async resetEverything() {
        try {
            console.log('Starting reset...');
            
            // Reset local data FIRST (immediate visual feedback)
            this.totalRating = 0;
            this.ratingCount = 0;
            this.comments = [];
            this.updateRatingDisplay(0, 0);
            this.displayComments();
            
            // Clear ALL localStorage related to ratings and comments
            localStorage.removeItem('userHasRated');
            localStorage.removeItem('userRating');
            localStorage.removeItem('userHasCommented');
            localStorage.removeItem('lastCommentReset');
            localStorage.removeItem('userRatingValue');
            localStorage.removeItem('hasRated');
            localStorage.removeItem('hasCommented');
            localStorage.removeItem('ratingSubmitted');
            localStorage.removeItem('commentSubmitted');
            
            // Also clear any other potential localStorage items
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('rating') || key.includes('comment') || key.includes('user'))) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            console.log('Local data reset complete');
            
            // Try to clear Firebase data
            try {
                const { db, collection, getDocs, doc, deleteDoc } = window.firebaseApp;
                
                // Clear all ratings
                const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
                console.log(`Found ${ratingsSnapshot.size} ratings to delete`);
                
                const ratingDeletePromises = [];
                ratingsSnapshot.forEach((docSnapshot) => {
                    ratingDeletePromises.push(deleteDoc(doc(db, 'ratings', docSnapshot.id)));
                });
                
                // Clear all comments
                const commentsSnapshot = await getDocs(collection(db, 'comments'));
                console.log(`Found ${commentsSnapshot.size} comments to delete`);
                
                const commentDeletePromises = [];
                commentsSnapshot.forEach((docSnapshot) => {
                    commentDeletePromises.push(deleteDoc(doc(db, 'comments', docSnapshot.id)));
                });
                
                await Promise.all([...ratingDeletePromises, ...commentDeletePromises]);
                console.log('Firebase data cleared successfully');
            } catch (firebaseError) {
                console.log('Firebase clear failed, but local reset worked:', firebaseError);
            }
            
            this.showMessage('Everything has been reset! Starting fresh.', 'success');
            console.log('Reset completed successfully!');
        } catch (error) {
            console.error('Error resetting:', error);
            this.showMessage('Failed to reset. Please try again.', 'error');
        }
    }

    // Simple reset function for immediate use
    forceReset() {
        console.log('Force resetting...');
        this.totalRating = 0;
        this.ratingCount = 0;
        this.comments = [];
        this.updateRatingDisplay(0, 0);
        this.displayComments();
        localStorage.removeItem('userHasRated');
        localStorage.removeItem('lastCommentReset');
        this.showMessage('Force reset complete!', 'success');
        console.log('Force reset done!');
    }

    // Emergency reset - direct DOM manipulation
    emergencyReset() {
        console.log('Emergency reset starting...');
        
        // Directly update the DOM elements using IDs
        const averageRating = document.getElementById('average-rating');
        const ratingMessage = document.getElementById('rating-message');
        
        if (averageRating) {
            averageRating.textContent = 'Average: 0% (0 votes)';
            console.log('Updated average rating display');
        } else {
            console.log('Could not find average-rating element');
        }
        
        if (ratingMessage) {
            ratingMessage.textContent = 'Click a star to rate!';
            console.log('Updated rating message');
        } else {
            console.log('Could not find rating-message element');
        }
        
        // Reset all stars to empty
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.classList.remove('active');
        });
        console.log(`Reset ${stars.length} stars`);
        
        // Reset internal data
        this.totalRating = 0;
        this.ratingCount = 0;
        this.comments = [];
        
        // Clear localStorage
        localStorage.removeItem('userHasRated');
        localStorage.removeItem('userRating');
        localStorage.removeItem('userHasCommented');
        localStorage.removeItem('lastCommentReset');
        
        // Clear comments display
        const commentsContainer = document.querySelector('.comments-container');
        if (commentsContainer) {
            commentsContainer.innerHTML = '<p style="text-align: center; color: var(--text-color); opacity: 0.7;">No comments yet. Be the first to comment!</p>';
        }
        
        this.showMessage('Emergency reset complete! Ratings are now 0!', 'success');
        console.log('Emergency reset completed!');
    }

    // SUPER SIMPLE RESET - Just change the text directly
    simpleReset() {
        // Find and change the rating text directly
        const ratingElement = document.querySelector('#average-rating');
        if (ratingElement) {
            ratingElement.innerHTML = 'Average: 0% (0 votes)';
        }
        
        // Find and change the message
        const messageElement = document.querySelector('#rating-message');
        if (messageElement) {
            messageElement.innerHTML = 'Click a star to rate!';
        }
        
        // Clear stars
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        
        // Clear localStorage
        localStorage.removeItem('userHasRated');
        localStorage.removeItem('userRating');
        localStorage.removeItem('userHasCommented');
        localStorage.removeItem('lastCommentReset');
        
        playSuccessSound();
        alert('RESET COMPLETE! Ratings are now 0!');
    }

    // Function to show messages inside the website
    showMessage(text, type = 'info') {
        // Play error sound if it's an error message
        if (type === 'error' && typeof playErrorSound === 'function') {
            playErrorSound();
        }
        
        // Play success sound if it's a success message
        if (type === 'success' && typeof playSuccessSound === 'function') {
            playSuccessSound();
        }

        // Remove existing message
        const existingMessage = document.getElementById('system-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.id = 'system-message';
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;

        if (type === 'error') {
            message.style.backgroundColor = '#ff4444';
            message.style.color = 'white';
        } else if (type === 'success') {
            message.style.backgroundColor = '#44ff44';
            message.style.color = 'black';
        } else {
            message.style.backgroundColor = '#4444ff';
            message.style.color = 'white';
        }

        document.body.appendChild(message);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 4000);
    }

    // Auto-reset comments every 2 weeks
    checkAutoReset() {
        const lastReset = localStorage.getItem('lastCommentReset');
        const now = new Date();
        const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

        // Only reset if there's a lastReset date AND it's been more than 2 weeks
        if (lastReset && (now - new Date(lastReset)) > twoWeeks) {
            this.autoResetComments();
            localStorage.setItem('lastCommentReset', now.toISOString());
        } else if (!lastReset) {
            // Set initial reset date if none exists (don't reset comments on first visit)
            localStorage.setItem('lastCommentReset', now.toISOString());
        }
    }

    async autoResetComments() {
        try {
            const { db, collection, getDocs, doc, deleteDoc } = window.firebaseApp;
            const commentsSnapshot = await getDocs(collection(db, 'comments'));
            
            const deletePromises = [];
            commentsSnapshot.forEach((docSnapshot) => {
                deletePromises.push(deleteDoc(doc(db, 'comments', docSnapshot.id)));
            });
            
            await Promise.all(deletePromises);
            this.comments = [];
            this.displayComments();
            this.showMessage('Comments have been automatically reset!', 'success');
            console.log('Comments auto-reset completed!');
        } catch (error) {
            console.error('Error auto-resetting comments:', error);
        }
    }

    // Check when next auto-reset will happen
    getNextResetDate() {
        const lastReset = localStorage.getItem('lastCommentReset');
        if (!lastReset) {
            return 'No reset date set yet';
        }
        
        const lastResetDate = new Date(lastReset);
        const nextResetDate = new Date(lastResetDate.getTime() + (2 * 7 * 24 * 60 * 60 * 1000)); // 2 weeks
        const now = new Date();
        const timeUntilReset = nextResetDate - now;
        
        if (timeUntilReset <= 0) {
            return 'Reset is due now!';
        }
        
        const days = Math.floor(timeUntilReset / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeUntilReset % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        
        return `Next reset in ${days} days and ${hours} hours (${nextResetDate.toLocaleDateString()})`;
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Prevent multiple initializations
    if (window.ratingCommentSystem) {
        console.log('Rating comment system already initialized, skipping...');
        return;
    }
    
    window.ratingCommentSystem = new RatingCommentSystem();
    
    // Set up event listeners
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            window.ratingCommentSystem.submitRating(rating);
        }
    });

    // Comment submit button event listener
    const submitButton = document.getElementById('submit-comment');
    if (submitButton) {
        // Clear any existing event listeners by cloning the element
        const newSubmitButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
        
        // Add single event listener to the new button
        newSubmitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Submit button clicked!');
            const commentText = document.getElementById('comment-input').value;
            console.log('Comment text:', commentText);
            window.ratingCommentSystem.submitComment(commentText);
        });
        console.log('Submit button event listener attached');
    } else {
        console.error('Submit button not found!');
    }

    // See more button event listener
    const seeMoreButton = document.getElementById('see-more-btn');
    if (seeMoreButton) {
        seeMoreButton.addEventListener('click', () => {
            window.ratingCommentSystem.toggleSeeMore();
        });
        console.log('See more button event listener attached');
    }

    // Allow Enter key to submit comments
    const commentInput = document.getElementById('comment-input');
    if (commentInput) {
        // Clear any existing event listeners by cloning the element
        const newCommentInput = commentInput.cloneNode(true);
        commentInput.parentNode.replaceChild(newCommentInput, commentInput);
        
        // Add single event listener to the new input
        newCommentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key pressed!');
                const commentText = document.getElementById('comment-input').value;
                console.log('Comment text:', commentText);
                window.ratingCommentSystem.submitComment(commentText);
            }
        });
        console.log('Comment input event listener attached');
    } else {
        console.error('Comment input not found!');
    }
});

// Global functions for testing
window.checkNextReset = () => {
    if (window.ratingCommentSystem) {
        const nextReset = window.ratingCommentSystem.getNextResetDate();
        console.log('Next comment reset:', nextReset);
        playSuccessSound();
    alert(nextReset);
    }
};

// Reset functions
window.forceReset = () => {
    if (window.ratingCommentSystem) {
        window.ratingCommentSystem.forceReset();
    }
};

window.simpleReset = () => {
    if (window.ratingCommentSystem) {
        window.ratingCommentSystem.simpleReset();
    }
};

window.emergencyReset = () => {
    if (window.ratingCommentSystem) {
        window.ratingCommentSystem.emergencyReset();
    }
};

window.resetEverything = () => {
    if (window.ratingCommentSystem) {
        window.ratingCommentSystem.resetEverything();
    }
};

window.autoResetComments = () => {
    if (window.ratingCommentSystem) {
        window.ratingCommentSystem.autoResetComments();
    }
};

// Complete localStorage reset
window.clearAllStorage = () => {
    localStorage.clear();
    console.log('All localStorage cleared!');
    playSuccessSound();
    alert('All localStorage cleared! Users can now rate and comment again.');
};

// Reset comment ability for all users (clears localStorage flags)
window.resetCommentAbility = () => {
    const confirmReset = confirm('⚠️ This will allow ALL users to comment again!\n\nThis clears the "already commented" flags for all users.\n\nAre you sure you want to continue?');
    
    if (!confirmReset) {
        console.log('Comment ability reset cancelled by user');
        return;
    }

    // Clear all comment-related flags
    localStorage.removeItem('userHasCommented');
    localStorage.removeItem('hasCommented');
    localStorage.removeItem('commentSubmitted');
    localStorage.removeItem('lastCommentReset');
    
    console.log('Comment ability reset for all users!');
    if (typeof playSuccessSound === 'function') { playSuccessSound(); }
    alert('✅ All users can now comment again!\n\nNote: This only affects users who visit the site after this reset.');
};

// Reset all comments from Firebase (for all users)
window.resetAllComments = async () => {
    if (!window.firebaseApp) {
        console.error('Firebase not available');
        if (typeof playErrorSound === 'function') { playErrorSound(); }
        alert('Firebase not available. Please refresh the page and try again.');
        return;
    }

    const confirmReset = confirm('⚠️ WARNING: This will delete ALL comments from the database for ALL users!\n\nThis action cannot be undone. Are you sure you want to continue?');
    
    if (!confirmReset) {
        console.log('Comment reset cancelled by user');
        return;
    }

    try {
        const { db, collection, getDocs, doc, deleteDoc } = window.firebaseApp;
        
        // Get all comments
        const commentsSnapshot = await getDocs(collection(db, 'comments'));
        console.log(`Found ${commentsSnapshot.size} comments to delete`);
        
        if (commentsSnapshot.size === 0) {
            console.log('No comments found to delete');
            if (typeof playSuccessSound === 'function') { playSuccessSound(); }
            alert('No comments found to delete.');
            return;
        }

        // Delete all comments
        const deletePromises = [];
        commentsSnapshot.forEach((docSnapshot) => {
            deletePromises.push(deleteDoc(doc(db, 'comments', docSnapshot.id)));
        });

        await Promise.all(deletePromises);
        
        console.log(`Successfully deleted ${commentsSnapshot.size} comments from Firebase`);
        
        // Clear user comment flags so they can comment again
        localStorage.removeItem('userHasCommented');
        localStorage.removeItem('hasCommented');
        localStorage.removeItem('commentSubmitted');
        
        // Reload comments to update the display
        if (window.ratingCommentSystem) {
            await window.ratingCommentSystem.loadComments();
        }
        
        if (typeof playSuccessSound === 'function') { playSuccessSound(); }
        alert(`✅ Successfully deleted ${commentsSnapshot.size} comments from the database!\n\nAll users can now comment again!`);
        
    } catch (error) {
        console.error('Error resetting all comments:', error);
        if (typeof playErrorSound === 'function') { playErrorSound(); }
        alert('❌ Error deleting comments. Please try again or check the console for details.');
    }
};

// Complete comment system reset (deletes comments + resets ability)
window.resetCommentSystem = async () => {
    if (!window.firebaseApp) {
        console.error('Firebase not available');
        if (typeof playErrorSound === 'function') { playErrorSound(); }
        alert('Firebase not available. Please refresh the page and try again.');
        return;
    }

    const confirmReset = confirm('⚠️ COMPLETE COMMENT SYSTEM RESET\n\nThis will:\n• Delete ALL comments from the database\n• Allow ALL users to comment again\n• Reset the 2-week auto-reset timer\n\nThis action cannot be undone. Are you sure?');
    
    if (!confirmReset) {
        console.log('Complete comment system reset cancelled by user');
        return;
    }

    try {
        const { db, collection, getDocs, doc, deleteDoc } = window.firebaseApp;
        
        // Get all comments
        const commentsSnapshot = await getDocs(collection(db, 'comments'));
        console.log(`Found ${commentsSnapshot.size} comments to delete`);
        
        // Delete all comments
        if (commentsSnapshot.size > 0) {
            const deletePromises = [];
            commentsSnapshot.forEach((docSnapshot) => {
                deletePromises.push(deleteDoc(doc(db, 'comments', docSnapshot.id)));
            });
            await Promise.all(deletePromises);
            console.log(`Successfully deleted ${commentsSnapshot.size} comments from Firebase`);
        }
        
        // Clear ALL comment-related flags and localStorage
        localStorage.removeItem('userHasCommented');
        localStorage.removeItem('hasCommented');
        localStorage.removeItem('commentSubmitted');
        localStorage.removeItem('lastCommentReset');
        localStorage.removeItem('userHasRated');
        localStorage.removeItem('userRating');
        localStorage.removeItem('userRatingValue');
        localStorage.removeItem('hasRated');
        localStorage.removeItem('ratingSubmitted');
        
        // Clear local comments array and update display immediately
        if (window.ratingCommentSystem) {
            window.ratingCommentSystem.comments = [];
            window.ratingCommentSystem.displayComments();
            console.log('Local comments cleared and display updated');
        }
        
        // Force clear the comment input field
        const commentInput = document.getElementById('comment-input');
        if (commentInput) {
            commentInput.value = '';
        }
        
        if (typeof playSuccessSound === 'function') { playSuccessSound(); }
        alert(`✅ COMPLETE COMMENT SYSTEM RESET SUCCESSFUL!\n\n• Deleted ${commentsSnapshot.size} comments from database\n• All users can now comment again\n• 2-week auto-reset timer reset\n\nYour comment system is now fresh and ready!`);
        
    } catch (error) {
        console.error('Error in complete comment system reset:', error);
        if (typeof playErrorSound === 'function') { playErrorSound(); }
        alert('❌ Error during complete reset. Please try again or check the console for details.');
    }
};

// Test function to check if reset worked
window.testCommentReset = () => {
    const hasCommented = localStorage.getItem('userHasCommented');
    const commentCount = window.ratingCommentSystem ? window.ratingCommentSystem.comments.length : 'N/A';
    
    console.log('=== COMMENT RESET TEST ===');
    console.log('userHasCommented flag:', hasCommented);
    console.log('Local comments count:', commentCount);
    console.log('Can user comment?', !hasCommented ? 'YES' : 'NO');
    
    if (typeof playSuccessSound === 'function') { playSuccessSound(); }
    alert(`Comment Reset Test Results:\n\n• userHasCommented: ${hasCommented || 'CLEARED'}\n• Local comments: ${commentCount}\n• Can comment: ${!hasCommented ? 'YES' : 'NO'}`);
};

window.testBadWords = (text) => {
    if (window.ratingCommentSystem) {
        // Test the bad word filter with same logic as the actual filter
        const badWords = [
            // Basic bad words
            'fuck', 'shit', 'damn', 'bitch', 'asshole', 'stupid', 'idiot', 'hate', 'kill', 'die', 'crap', 'hell', 'wtf', 'omg', 'fucking', 'shitty', 'damned', 'bitchy', 'ass', 'dumb', 'moron', 'retard', 'gay', 'lesbian', 'nigger', 'nigga', 'faggot', 'whore', 'slut', 'porn', 'sex', 'pornography', 'xxx', 'adult', 'nude', 'naked',
            // More bad words
            'bastard', 'cunt', 'cock', 'dick', 'penis', 'vagina', 'boobs', 'tits', 'breast', 'pussy', 'ass', 'butt', 'arse', 'fart', 'poop', 'pee', 'piss', 'urine', 'feces', 'crap', 'bullshit', 'horseshit', 'cowshit', 'dogshit', 'ratshit', 'pissed', 'pissed off', 'piss off', 'fuck off', 'fuck you', 'fuck this', 'fuck that', 'fuck up', 'fuck up', 'fucked up', 'fucking hell', 'holy shit', 'what the fuck', 'oh my god', 'jesus christ', 'goddamn', 'bloody hell', 'son of a bitch', 'piece of shit', 'you suck', 'you are stupid', 'you are dumb', 'you are an idiot', 'kill yourself', 'go die', 'fuck this', 'fuck that', 'bullshit', 'this is shit', 'that is shit', 'so stupid', 'so dumb', 'so annoying', 'hate this', 'hate you', 'fuck up', 'screw you', 'damn it', 'shit happens', 'fucking awesome', 'fucking great', 'fucking bad', 'fucking good', 'fucking stupid', 'fucking idiot', 'fucking moron', 'fucking retarded', 'fucking gay', 'fucking lesbian', 'fucking nigger', 'fucking nigga', 'fucking faggot', 'fucking whore', 'fucking slut', 'fucking porn', 'fucking sex', 'fucking adult', 'fucking nude', 'fucking naked',
            // Variations with spaces
            'f u c k', 's h i t', 'd a m n', 'b i t c h', 'a s s h o l e', 's t u p i d', 'i d i o t', 'h a t e', 'k i l l', 'd i e', 'c r a p', 'h e l l', 'w t f', 'o m g', 'f u c k i n g', 's h i t t y', 'd a m n e d', 'b i t c h y', 'a s s', 'd u m b', 'm o r o n', 'r e t a r d', 'g a y', 'l e s b i a n', 'n i g g e r', 'n i g g a', 'f a g g o t', 'w h o r e', 's l u t', 'p o r n', 's e x', 'p o r n o g r a p h y', 'x x x', 'a d u l t', 'n u d e', 'n a k e d',
            // Variations with special characters
            'f@ck', 'sh!t', 'd@mn', 'b!tch', 'a$$hole', 'st*pid', '!d!ot', 'h@te', 'k!ll', 'd!e', 'cr@p', 'h3ll', 'wtf', '0mg', 'f*cking', 'sh!tty', 'd@mned', 'b!tchy', 'a$$', 'd*mb', 'm0r0n', 'r3t@rd', 'g@y', 'l3sb!@n', 'n!gg3r', 'n!gg@', 'f@gg0t', 'wh0r3', 'sl*t', 'p0rn', 's3x', 'p0rn0gr@phy', 'xxx', '4dult', 'nud3', 'n@k3d'
        ];
        
        const commentLower = text.toLowerCase();
        
        for (let badWord of badWords) {
            // Use word boundary regex to avoid partial matches
            const regex = new RegExp('\\b' + badWord.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
            if (regex.test(commentLower)) {
                console.log('BAD WORD DETECTED:', badWord);
                return false;
            }
            
            // Also check for exact matches (for words with spaces)
            if (commentLower.includes(badWord.toLowerCase())) {
                console.log('BAD WORD DETECTED (exact):', badWord);
                return false;
            }
        }
        
        console.log('Text is clean!');
        return true;
    }
};
