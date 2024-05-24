class ContactCreate {
    constructor(name, email, phone, message) {
        this.validateName(name);
        this.validateMessage(message);
  

        this.name = name;
        this.message = message;
        this.read = false;
        if (email) this.email = email;
        if (phone) this.phone = phone;
    }

    validateName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Name is required');
        }
    }

    validateMessage(message) {
        if (!message || typeof message !== 'string') {
            throw new Error('message is required');
        }
        
    }


}

export default ContactCreate;
