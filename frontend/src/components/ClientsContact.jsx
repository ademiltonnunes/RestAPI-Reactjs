import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState(new Set());

  useEffect(() => {
    axios.get('https://localhost:8080/contact')
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => console.error('Failed to fetch contacts:', error));
  }, [contacts]);

  const handleCheckboxChange = (contactId) => {
    setSelectedContacts(prevSelectedContacts => {
      const newSet = new Set(prevSelectedContacts);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  const handleConfirmRead = () => {
    selectedContacts.forEach(contactId => {
      axios.patch(`https://localhost:8080/contact/${contactId}`)
        .then(() => {
          setContacts(contacts.map(contact =>
            selectedContacts.has(contact._id) ? { ...contact, read: true } : contact
          ));
        })
        .catch(error => console.error('Failed to mark contact as read:', error));
    });
  };

  return (
    <div className="client-contact-container">
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.message}</td>
              <td className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedContacts.has(contact._id)}
                  onChange={() => handleCheckboxChange(contact._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="contact-confirm-button " onClick={handleConfirmRead}>
        Confirm Messages Read
      </button>
    </div>
  );
};

export default ContactsList;
