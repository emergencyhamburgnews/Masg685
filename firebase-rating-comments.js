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
        this.updateStars(rating);
        
        // Mark user as having rated
        localStorage.setItem('userHasRated', 'true');
        
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
            this.comments = [];
            snapshot.forEach(doc => {
                this.comments.push({ id: doc.id, ...doc.data() });
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
        if (!commentText.trim()) {
            this.showMessage('Please enter a comment!', 'error');
            return;
        }

        // Add comment locally immediately
        const newComment = {
            id: 'local_' + Date.now(),
            text: commentText.trim(),
            author: 'Guest User',
            timestamp: new Date()
        };
        
        this.comments.unshift(newComment);
        this.displayComments();
        document.getElementById('comment-input').value = '';
        
        // Try to save to Firebase (optional)
        try {
            const { db, collection, addDoc } = window.firebaseApp;
            await addDoc(collection(db, 'comments'), {
                text: commentText.trim(),
                author: 'Guest User',
                timestamp: new Date()
            });
            console.log('Comment saved to Firebase successfully!');
        } catch (error) {
            console.error('Firebase save failed, but comment still works locally:', error);
            // Comment still works locally even if Firebase fails
        }
    }

    displayComments() {
        const commentsContainer = document.getElementById('comments-container');
        const commentsToShow = this.showingAllComments ? this.comments : this.comments.slice(0, 5);
        
        commentsContainer.innerHTML = '';
        
        if (commentsToShow.length === 0) {
            commentsContainer.innerHTML = '<p style="text-align: center; color: var(--text-color); opacity: 0.7;">No comments yet. Be the first to comment!</p>';
            return;
        }

        commentsToShow.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMEgxOEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+" 
                         alt="Guest" class="comment-avatar">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-time">${this.formatTime(comment.timestamp)}</div>
                </div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsContainer.appendChild(commentElement);
        });

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
        const commentTime = timestamp.toDate();
        const diffInSeconds = Math.floor((now - commentTime) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
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
            
            // Clear localStorage
            localStorage.removeItem('userHasRated');
            localStorage.removeItem('lastCommentReset');
            
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
        localStorage.clear();
        
        alert('RESET COMPLETE! Ratings are now 0!');
    }

    // Function to show messages inside the website
    showMessage(text, type = 'info') {
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

    // Auto-reset comments every 5 weeks
    checkAutoReset() {
        const lastReset = localStorage.getItem('lastCommentReset');
        const now = new Date();
        const fiveWeeks = 5 * 7 * 24 * 60 * 60 * 1000; // 5 weeks in milliseconds

        if (!lastReset || (now - new Date(lastReset)) > fiveWeeks) {
            this.autoResetComments();
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
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ratingCommentSystem = new RatingCommentSystem();
    
    // Set up event listeners
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            window.ratingCommentSystem.submitRating(rating);
        }
    });

    document.getElementById('submit-comment').addEventListener('click', () => {
        const commentText = document.getElementById('comment-input').value;
        window.ratingCommentSystem.submitComment(commentText);
    });

    document.getElementById('see-more-btn').addEventListener('click', () => {
        window.ratingCommentSystem.toggleSeeMore();
    });

    // Allow Enter key to submit comments
    document.getElementById('comment-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const commentText = document.getElementById('comment-input').value;
            window.ratingCommentSystem.submitComment(commentText);
        }
    });
});
