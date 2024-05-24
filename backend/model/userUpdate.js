class UserUpdate {
    constructor(originalObject, username, email, password) {
        this.validateUsername(username);
        this.validateEmail(email);
        this.validatePassword(password);

        this.username = username? username : originalObject.username, 
        this.email = email? email : originalObject.email;
        this.password = password? password : originalObject.password;
    }

    validateUsername(username) {
        if (username && typeof username !== 'string') {
            throw new Error('Username is required');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            throw new Error('Invalid email address format');
        }
    }

    validatePassword(password) {
        if (password && typeof password !== 'string') {
            throw new Error('Password must be a string');
        }

        if (password && password.length < 8) {
            throw new Error('Password must have a minimum size of 8 characters');
        }
    }
}

export default UserUpdate;
