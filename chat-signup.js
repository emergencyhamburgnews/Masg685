// Chat Sign Up System with Username Validation
// Firebase will be available via window.firebaseApp

class ChatSignUp {
    constructor() {
        this.selectedColor = '#6c757d';
        this.isVerified = false;
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
        
        // Code redemption input
        const codeInput = document.getElementById('redemption-code');
        if (codeInput) {
            codeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.redeemCode();
                }
            });
        }
        
        // Check if user is already verified
        this.checkVerificationStatus();
        
        // Load existing profile data if user is editing
        this.loadExistingProfile();
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

    showError(message, type = 'error') {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Set background color based on message type
        if (type === 'success') {
            errorElement.style.backgroundColor = '#28a745';
        } else {
            errorElement.style.backgroundColor = '#dc3545';
        }
        
        // Play appropriate sound
        if (type === 'success') {
            this.playSuccessSound();
        } else {
            this.playErrorSound();
        }
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    playErrorSound() {
        try {
            const audio = new Audio('error message sound.mp3');
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.log('Could not play error sound:', error);
            });
        } catch (error) {
            console.log('Could not play error sound:', error);
        }
    }

    playSuccessSound() {
        try {
            const audio = new Audio('correct message sound.mp3');
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.log('Could not play success sound:', error);
            });
        } catch (error) {
            console.log('Could not play success sound:', error);
        }
    }

    async saveProfile() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        
        // Validate input - for verified users, only first name is required
        if (!firstName) {
            this.showError('Please enter at least your first name!');
            return;
        }
        
        if (!this.isVerified && !lastName) {
            this.showError('Please enter both first and last name! Redeem admin code to use only first name.');
            return;
        }

        const fullName = lastName ? `${firstName} ${lastName}` : firstName;
        const displayName = firstName; // Only show first name in chat
        const username = fullName.toLowerCase();

        // Validate username
        const validationError = this.validateUsername(firstName, lastName);
        if (validationError) {
            this.showError(validationError);
            return;
        }

        // Check if username already exists (only for non-verified users)
        if (!this.isVerified) {
            const usernameExists = await this.checkUsernameExists(username);
            if (usernameExists) {
                this.showError('This name is already taken! Please choose a different name.');
                return;
            }
        }

        // Save user profile
        try {
            const { db, collection, addDoc } = window.firebaseApp;
            const userData = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                fullName: fullName,
                displayName: displayName, // Add display name for chat
                avatarColor: this.selectedColor,
                initials: lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : firstName[0].toUpperCase(),
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

            // Show success message
            this.showError('✅ Profile saved successfully! Redirecting to chat...', 'success');
            
            // Redirect after showing success message
            setTimeout(() => {
                window.location.href = 'live-chat.html';
            }, 1500);

        } catch (error) {
            console.error('Error saving profile:', error);
            this.showError('Error saving profile. Please try again.');
        }
    }

    redeemCode() {
        const codeInput = document.getElementById('redemption-code');
        const code = codeInput.value.trim();
        
        if (code === '2309') {
            // Correct code - grant verification
            this.isVerified = true;
            localStorage.setItem('isVerified', 'true');
            
            // Show verification status
            const verificationStatus = document.getElementById('verification-status');
            verificationStatus.style.display = 'block';
            
            // Clear the input
            codeInput.value = '';
            
            // Show success message
            this.showError('✅ Verified badge activated successfully!', 'success');
            
            console.log('User verified with admin code');
        } else {
            // Wrong code
            this.showError('❌ Invalid code! Please contact the administrator for a valid badge code.', 'error');
            codeInput.value = '';
        }
    }

    checkVerificationStatus() {
        const isVerified = localStorage.getItem('isVerified') === 'true';
        if (isVerified) {
            this.isVerified = true;
            const verificationStatus = document.getElementById('verification-status');
            verificationStatus.style.display = 'block';
        }
    }

    loadExistingProfile() {
        // Load existing user data from localStorage
        const userData = localStorage.getItem('chatUser');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                
                // Fill in the form fields
                const firstNameInput = document.getElementById('first-name');
                const lastNameInput = document.getElementById('last-name');
                
                if (firstNameInput && user.firstName) {
                    firstNameInput.value = user.firstName;
                }
                if (lastNameInput && user.lastName) {
                    lastNameInput.value = user.lastName;
                } else if (lastNameInput) {
                    lastNameInput.value = ''; // Clear if no last name
                }
                
                // Set the selected color
                if (user.avatarColor) {
                    this.selectedColor = user.avatarColor;
                    // Update the color selection UI
                    const colorOptions = document.querySelectorAll('.color-option');
                    colorOptions.forEach(option => {
                        option.classList.remove('selected');
                        if (option.dataset.color === user.avatarColor) {
                            option.classList.add('selected');
                        }
                    });
                }
                
                // Update the avatar display
                this.updateProfile();
                
                console.log('Loaded existing profile:', user);
            } catch (error) {
                console.error('Error loading existing profile:', error);
            }
        }
    }

    // Override the validateUsername method to allow special characters for verified users
    validateUsername(firstName, lastName) {
        const fullName = (firstName + lastName).toLowerCase();
        
        // For verified users, allow ANYTHING
        if (this.isVerified) {
            if (fullName.length < 1) {
                return 'Name must be at least 1 character long';
            }
            
            // Verified users can use ANY name, including reserved names
            return null; // Always valid for verified users
        }
        
        // Original validation for non-verified users
        if (fullName.length < 3) {
            return 'Name must be at least 3 letters long. Redeem admin code to use shorter names!';
        }
        
        // Check for numbers and symbols (only for non-verified users)
        if (/\d/.test(fullName) || /[^a-zA-Z]/.test(fullName)) {
            return 'Name can only contain letters (no numbers or symbols). Redeem admin code to use special characters!';
        }
        
        // Check for forbidden names (only for non-verified users)
        const forbiddenNames = ['masg685', 'masg', 'masaga'];
        if (forbiddenNames.includes(fullName)) {
            return 'This name is reserved and cannot be used. Redeem admin code to use reserved names!';
        }
        
        return null;
    }
}

// Global functions
function redeemCode() {
    if (window.chatSignUp) {
        window.chatSignUp.redeemCode();
    }
}

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
