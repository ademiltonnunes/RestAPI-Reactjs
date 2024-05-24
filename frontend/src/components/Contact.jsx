import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submissionMessage, setSubmissionMessage] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    axios.get('https://localhost:8080/maps/getMapIframe?location=Dr+Carlton+B+Goodlett+Pl,+San+Francisco,+CA+94102')
        .then(response => {
            setIframeUrl(response.data.embedUrl);
        })
        .catch(error => {
            console.error('Failed to fetch map URL:', error);
        });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    axios.post('https://localhost:8080/contact', formData)
      .then(response => {
        // Clear the form fields
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        // Display success message to the user
        setSubmissionMessage('Message sent, we are going to contact you soon.');
        setTimeout(() => setSubmissionMessage(''), 5000);
      })
      .catch(error => {
        // Display error message to the user
        console.error('There was a problem with the POST request:', error);
        setSubmissionMessage('There was an error sending your message. Please try again.');
      });
  };

  return (
    <div className="contact-page">
      <div className="contact-info">
        <h2>CONTACT US</h2>
        <p>Address: Dr Carlton B Goodlett Pl, San Francisco, CA 94102</p>
        <p>contact@3s.com</p>
        <p>Tel: (415) 456-7890</p>
        <div className="google-map">
          <iframe
            width="100%"
            height="300"
            frameborder="0"
            style={{ border: 0 }}
            src={iframeUrl}
            allowfullscreen>
          </iframe>
        </div>
      </div>
      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              required
              placeholder="Insert your name"
              onChange={handleInputChange}
              value={formData.name}
            />
          </div>
          <div>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Insert your email address"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              placeholder="Insert your phone number"
              onChange={handleInputChange}
              value={formData.phone}
            />
          </div>
          <div>
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="Insert your message"
              onChange={handleInputChange}
              value={formData.message}
            />
          </div>
          <button type="submit">Send</button>
        </form>
        {submissionMessage && <div className="submission-message">{submissionMessage}</div>}
      </div>
    </div>
  );
};

export default ContactPage;
