import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [animateWelcome, setAnimateWelcome] = useState(false);
  const [loginData, setLoginData] = useState({ phoneNumber: '', password: '' });
  const [signupData, setSignupData] = useState({ phoneNumber: '', password: '' });
  const [connections, setConnections] = useState([]);
  const [showAddConnectionForm, setShowAddConnectionForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    name: '',
    tags: '',
    description: '',
    linkedInURL: ''
  });
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/connections');
        setConnections(res.data);
      } catch (error) {
        console.log("Error fetching connections:", error);
      }
    };
    fetchConnections();
  }, []);

  useEffect(() => {
    if (confirmationMessage) {
      setTimeout(() => {
        setConfirmationMessage('');
      }, 4000);
    }
  }, [confirmationMessage]);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/login', loginData);
      if (res.status === 200) {
        setIsLoggedIn(true);
        setIsNewUser(false);
      }
    } catch (error) {
      setIsNewUser(false);
      setConfirmationMessage('Login failed');
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/register', signupData);
      if (res.status === 201) {
        setIsLoggedIn(true);
        setIsNewUser(true);
        setAnimateWelcome(true);
      }
    } catch (error) {
      setIsNewUser(false);
      setConfirmationMessage('Signup failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setConfirmationMessage('Invalid phone number format. Use 123-456-7890');
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/addConnection', formData);
      setConfirmationMessage('Connection successfully added to the database!');
      setFormData({
        phoneNumber: '',
        name: '',
        tags: '',
        description: '',
        linkedInURL: ''
      });
    } catch (error) {
      setConfirmationMessage('Failed to add connection. Please try again.');
    }
  };

  return (
    <div className='App'>
      <h1 className='site-title'>Connect.com</h1>
      {isLoggedIn ? (
        <div>
          <button onClick={() => setShowAddConnection(!showAddConnection)}>
            {showAddConnection ? 'Cancel' : 'Add New Connection'}
          </button>

          {showAddConnection && (
            <div style={{ backgroundColor: 'white', padding: '20px' }}>
              <h1>Add Connection</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Phone Number"
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Tags"
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  onChange={(e) => setFormData({ ...formData, linkedInURL: e.target.value })}
                />
                <button type="submit">Add</button>
              </form>
            </div>
          )}

          <div className='connections-list'>
            {connections.map((connection, index) => (
              <div key={index} className='connection-item'>
                <h2>{connection.name}</h2>
                <p>{connection.phoneNumber}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='login-container'>
          {showSignup ? (
            <div className='signup'>
              <h2>Sign Up</h2>
              <input type='text' placeholder='Phone Number' onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })} />
              <input type='password' placeholder='Password' onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
              <button type='button' onClick={handleSignup}>Sign Up</button>
            </div>
          ) : (
            <div className='login'>
              <h2>Login</h2>
              <input type='text' placeholder='Phone Number' onChange={(e) => setLoginData({ ...loginData, phoneNumber: e.target.value })} />
              <input type='password' placeholder='Password' onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              <button type='button' onClick={handleLogin}>Login</button>
            </div>
          )}
          <div className='mt-4'>
            <p className='text-center'>
              {showSignup ? 'Already have an account? ' : 'No account? '}
              <span onClick={() => setShowSignup(!showSignup)}>
                {showSignup ? 'Login' : 'Sign up'}
              </span>
            </p>
          </div>
        </div>
      )}
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
  );
}

export default App;

