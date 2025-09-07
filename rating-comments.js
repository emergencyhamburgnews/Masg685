// Rating and Comments System
class RatingCommentsSystem {
    constructor() {
        this.ratings = [];
        this.comments = [];
        this.inappropriateWords = [
            'fuck', 'shit', 'damn', 'bitch', 'ass', 'asshole', 'bastard', 'crap',
            'hell', 'piss', 'dick', 'cock', 'pussy', 'whore', 'slut', 'fag',
            'nigger', 'nigga', 'retard', 'idiot', 'stupid', 'dumb', 'moron',
            'hate', 'kill', 'die', 'death', 'murder', 'suicide', 'bomb',
            'terrorist', 'nazi', 'hitler', 'rape', 'sex', 'porn', 'xxx',
            'drug', 'cocaine', 'heroin', 'marijuana', 'weed', 'alcohol'
        ];
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
    }

    // Load data from localStorage
    loadData() {
        const savedRatings = localStorage.getItem('websiteRatings');
        const savedComments = localStorage.getItem('websiteComments');
        
        if (savedRatings) {
            this.ratings = JSON.parse(savedRatings);
        }
        
        if (savedComments) {
            this.comments = JSON.parse(savedComments);
        }
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('websiteRatings', JSON.stringify(this.ratings));
        localStorage.setItem('websiteComments', JSON.stringify(this.comments));
    }

    // Setup event listeners
    setupEventListeners() {
        // Rating stars
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', (e) => this.handleRating(e));
            star.addEventListener('mouseenter', (e) => this.highlightStars(e));
        });

        // Comment submission
        const submitBtn = document.getElementById('submit-comment');
        const commentInput = document.getElementById('comment-input');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitComment());
        }
        
        if (commentInput) {
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    this.submitComment();
                }
            });
        }

        // Clear messages after 3 seconds
        this.setupMessageCleanup();
    }

    // Handle star rating
    handleRating(e) {
        const rating = parseInt(e.target.dataset.rating);
        const userAgent = navigator.userAgent;
        const timestamp = new Date().toISOString();
        
        // Check if user already rated
        const existingRating = this.ratings.find(r => r.userAgent === userAgent);
        
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.timestamp = timestamp;
            this.showMessage('Rating updated!', 'success');
        } else {
            this.ratings.push({
                rating: rating,
                userAgent: userAgent,
                timestamp: timestamp
            });
            this.showMessage('Thank you for rating!', 'success');
        }
        
        this.saveData();
        this.updateDisplay();
        this.setSavedRating(rating);
    }

    // Highlight stars on hover
    highlightStars(e) {
        const rating = parseInt(e.target.dataset.rating);
        const stars = document.querySelectorAll('.star');
        const userAgent = navigator.userAgent;
        const existingRating = this.ratings.find(r => r.userAgent === userAgent);
        
        // Only highlight if user hasn't rated yet
        if (!existingRating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    }

    // Set saved rating (no hover effects)
    setSavedRating(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    // Calculate average rating
    calculateAverageRating() {
        if (this.ratings.length === 0) return 0;
        
        const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const average = total / this.ratings.length;
        return Math.round((average / 5) * 100);
    }

    // Submit comment
    submitComment() {
        const commentInput = document.getElementById('comment-input');
        const comment = commentInput.value.trim();
        
        if (!comment) {
            this.showMessage('Please write a comment before submitting.', 'error');
            return;
        }
        
        if (comment.length < 5) {
            this.showMessage('Comment must be at least 5 characters long.', 'error');
            return;
        }
        
        // Check for inappropriate words
        if (this.containsInappropriateWords(comment)) {
            this.showMessage('Your comment contains inappropriate language. Please revise your comment.', 'error');
            return;
        }
        
        // Check if user already commented
        const userAgent = navigator.userAgent;
        const existingComment = this.comments.find(c => c.userAgent === userAgent);
        
        if (existingComment) {
            this.showMessage('You have already submitted a comment. Only one comment per person is allowed.', 'error');
            return;
        }
        
        // Check if comment limit reached
        if (this.comments.length >= 5) {
            this.showMessage('Comment limit reached. Only 5 comments are allowed.', 'error');
            return;
        }
        
        // Add comment
        const guestNumber = this.comments.length + 1;
        const newComment = {
            id: Date.now(),
            text: comment,
            author: `Guest #${guestNumber}`,
            userAgent: userAgent,
            timestamp: new Date().toISOString(),
            browserInfo: this.getBrowserInfo()
        };
        
        this.comments.push(newComment);
        this.saveData();
        this.updateDisplay();
        
        commentInput.value = '';
        this.showMessage('Comment submitted successfully!', 'success');
    }

    // Check for inappropriate words
    containsInappropriateWords(text) {
        const lowerText = text.toLowerCase();
        return this.inappropriateWords.some(word => lowerText.includes(word));
    }

    // Get browser/device info
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown Browser';
        let device = 'Desktop';
        
        // Detect browser
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        
        // Detect device
        if (userAgent.includes('Mobile')) device = 'Mobile';
        else if (userAgent.includes('Tablet')) device = 'Tablet';
        
        return `${browser} on ${device}`;
    }

    // Update display
    updateDisplay() {
        this.updateRatingDisplay();
        this.updateCommentsDisplay();
    }

    // Update rating display
    updateRatingDisplay() {
        const averageElement = document.getElementById('average-rating');
        const messageElement = document.getElementById('rating-message');
        const userAgent = navigator.userAgent;
        const existingRating = this.ratings.find(r => r.userAgent === userAgent);
        
        if (averageElement) {
            const average = this.calculateAverageRating();
            const voteCount = this.ratings.length;
            averageElement.textContent = `Average: ${average}% (${voteCount} vote${voteCount !== 1 ? 's' : ''})`;
        }
        
        if (messageElement) {
            if (this.ratings.length === 0) {
                messageElement.textContent = 'Click a star to rate!';
            } else if (existingRating) {
                messageElement.textContent = `You rated: ${existingRating.rating} stars`;
            } else {
                messageElement.textContent = 'Thank you for your feedback!';
            }
        }
        
        // Show saved rating if user has rated
        if (existingRating) {
            this.setSavedRating(existingRating.rating);
        }
    }

    // Update comments display
    updateCommentsDisplay() {
        const commentsList = document.getElementById('comments-list');
        const commentCounter = document.getElementById('comment-counter');
        
        if (commentCounter) {
            commentCounter.textContent = `Comments: ${this.comments.length}/5`;
        }
        
        if (commentsList) {
            commentsList.innerHTML = '';
            
            if (this.comments.length === 0) {
                commentsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No comments yet. Be the first to comment!</p>';
            } else {
                this.comments.forEach(comment => {
                    const commentElement = this.createCommentElement(comment);
                    commentsList.appendChild(commentElement);
                });
            }
        }
    }

    // Create comment element
    createCommentElement(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-item';
        
        const date = new Date(comment.timestamp).toLocaleDateString();
        
        commentDiv.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${date}</span>
            </div>
            <div class="comment-text">${this.escapeHtml(comment.text)}</div>
            <div class="comment-browser" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
                ${comment.browserInfo}
            </div>
        `;
        
        return commentDiv;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show message
    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        // Insert message after the comment form
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            commentForm.insertAdjacentElement('afterend', messageDiv);
        }
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // Setup message cleanup
    setupMessageCleanup() {
        setInterval(() => {
            const messages = document.querySelectorAll('.error-message, .success-message');
            messages.forEach(msg => {
                if (Date.now() - msg.dataset.timestamp > 3000) {
                    msg.remove();
                }
            });
        }, 1000);
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RatingCommentsSystem();
});
