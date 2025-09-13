// Chat Sign Up System with Username Validation
// Firebase will be available via window.firebaseApp

class ChatSignUp {
    constructor() {
        this.selectedColor = '#6c757d';
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
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Color selection
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
                this.selectedColor = option.dataset.color;
                this.updateAvatar();
            });
        });

        // Name input changes
        const firstNameInput = document.getElementById('first-name');
        const lastNameInput = document.getElementById('last-name');

        firstNameInput.addEventListener('input', () => this.updateProfile());
        lastNameInput.addEventListener('input', () => this.updateProfile());

        // Set default color as selected
        colorOptions[0].classList.add('selected');
    }

    updateProfile() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        
        // Update profile name
        const profileName = document.getElementById('profile-name');
        if (firstName && lastName) {
            profileName.textContent = `${firstName} ${lastName}`;
        } else if (firstName) {
            profileName.textContent = firstName;
        } else if (lastName) {
            profileName.textContent = lastName;
        } else {
            profileName.textContent = 'Name User';
        }

        this.updateAvatar();
    }

    updateAvatar() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        
        // Update avatar background color
        const avatar = document.getElementById('profile-avatar');
        avatar.style.backgroundColor = this.selectedColor;
        
        // Update avatar initials
        const initials = document.getElementById('avatar-initials');
        if (firstName && lastName) {
            initials.textContent = `${firstName[0]}${lastName[0]}`.toUpperCase();
        } else if (firstName) {
            initials.textContent = firstName[0].toUpperCase();
        } else if (lastName) {
            initials.textContent = lastName[0].toUpperCase();
        } else {
            initials.textContent = 'NU';
        }
    }

    validateUsername(firstName, lastName) {
        const fullName = `${firstName} ${lastName}`.trim();
        const username = fullName.toLowerCase();

        // Check minimum length (3+ letters)
        if (fullName.length < 3) {
            return { valid: false, error: 'Name must be at least 3 letters long!' };
        }

        // Check for numbers and special characters
        const invalidChars = /[0-9?/>.<,"':;{}[\]+=_\-)(*&^%$#@!]/;
        if (invalidChars.test(fullName)) {
            return { valid: false, error: 'Name cannot contain numbers or special characters!' };
        }

        // Check for forbidden names
        const forbiddenNames = ['masg685', 'masg', 'masaga', 'masq685', 'masq'];
        if (forbiddenNames.includes(username)) {
            return { valid: false, error: 'This name cannot be used!' };
        }

        // Check if name contains only letters and spaces
        const validNamePattern = /^[a-zA-Z\s]+$/;
        if (!validNamePattern.test(fullName)) {
            return { valid: false, error: 'Name can only contain letters and spaces!' };
        }

        return { valid: true };
    }

    async checkUsernameExists(username) {
        try {
            const { db, collection, getDocs, query, where } = window.firebaseApp;
            const usersSnapshot = await getDocs(
                query(collection(db, 'chatUsers'), where('username', '==', username))
            );
            return !usersSnapshot.empty;
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Play error sound
        this.playErrorSound();
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    playErrorSound() {
        // Create and play error sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    async saveProfile() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        
        // Validate input
        if (!firstName || !lastName) {
            this.showError('Please enter both first and last name!');
            return;
        }

        const fullName = `${firstName} ${lastName}`;
        const username = fullName.toLowerCase();

        // Validate username
        const validation = this.validateUsername(firstName, lastName);
        if (!validation.valid) {
            this.showError(validation.error);
            return;
        }

        // Check if username already exists
        const usernameExists = await this.checkUsernameExists(username);
        if (usernameExists) {
            this.showError('This name is already taken! Please choose a different name.');
            return;
        }

        // Save user profile
        try {
            const { db, collection, addDoc } = window.firebaseApp;
            const userData = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                fullName: fullName,
                avatarColor: this.selectedColor,
                initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
                createdAt: new Date(),
                isActive: true
            };

            const docRef = await addDoc(collection(db, 'chatUsers'), userData);
            console.log('User profile saved:', docRef.id);

            // Store user data in localStorage
            localStorage.setItem('chatUser', JSON.stringify({
                id: docRef.id,
                ...userData
            }));

            // Always go back to live chat after saving profile
            // DON'T overwrite the previous page - keep the original page
            window.location.href = 'live-chat.html';

        } catch (error) {
            console.error('Error saving profile:', error);
            this.showError('Error saving profile. Please try again.');
        }
    }
}

// Global functions
function goBack() {
    const previousPage = localStorage.getItem('previousPage');
    console.log('Signup go back - Previous page:', previousPage);
    
    // If we have a previous page and it's a normal page (not chat/signup), go there
    if (previousPage && !previousPage.includes('live-chat.html') && !previousPage.includes('chat-signup.html')) {
        console.log('Going back to normal page:', previousPage);
        window.location.href = previousPage;
    } else {
        // If no valid previous page, go to live chat
        console.log('Going back to live chat');
        window.location.href = 'live-chat.html';
    }
}

function saveProfile() {
    if (window.chatSignUp) {
        window.chatSignUp.saveProfile();
    }
}

function editProfile() {
    // This could be used for editing profile in the future
    console.log('Edit profile clicked');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.chatSignUp = new ChatSignUp();
});
