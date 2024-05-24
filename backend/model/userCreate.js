class UserCreate {
    constructor(username, email, password) {
        this.validateUsername(username);
        this.validateEmail(email);
        this.validatePassword(password);

        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = new Date();
    }

    validateUsername(username) {
        if (!username || typeof username !== 'string') {
            throw new Error('Username is required');
        }
    }

    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new Error('Email is required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email address format');
        }
    }

    validatePassword(password) {
        if (!password || typeof password !== 'string') {
            throw new Error('Password is required and must be a string');
        }

        if (password.length < 8) {
            throw new Error('Password must have a minimum size of 8 characters');
        }
    }
}

export default UserCreate;
