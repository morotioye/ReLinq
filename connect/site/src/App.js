import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Snackbar, Paper, Grid } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

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

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Connect.com
      </Typography>

      {isLoggedIn ? (
        <div>
          <Button variant="contained" color="primary" onClick={() => setShowAddConnection(!showAddConnection)}>
            {showAddConnection ? 'Cancel' : 'Add New Connection'}
          </Button>

          {showAddConnection && (
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h4">Add Connection</Typography>
              <form onSubmit={handleSubmit}>
                <TextField label="Phone Number" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                <TextField label="Name" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <TextField label="Tags" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                <TextField label="Description" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                <TextField label="LinkedIn URL" variant="outlined" fullWidth onChange={(e) => setFormData({ ...formData, linkedInURL: e.target.value })} />
                <Button variant="contained" color="primary" type="submit">
                  Add
                </Button>
              </form>
            </Paper>
          )}

          {/* ... (Your connections list code remains the same) */}
        </div>
      ) : (
        <Paper elevation={3} style={{ padding: '20px' }}>
          {showSignup ? (
            <div>
              <Typography variant="h4">Sign Up</Typography>
              <TextField label="Phone Number" variant="outlined" fullWidth onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })} />
              <TextField label="Password" variant="outlined" type="password" fullWidth onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
              <Button variant="contained" color="primary" onClick={handleSignup}>
                Sign Up
              </Button>
            </div>
          ) : (
            <div>
              <Typography variant="h4">Login</Typography>
              <TextField label="Phone Number" variant="outlined" fullWidth onChange={(e) => setLoginData({ ...loginData, phoneNumber: e.target.value })} />
              <TextField label="Password" variant="outlined" type="password" fullWidth onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
              </Button>
            </div>
          )}
          <Typography variant="body1" onClick={() => setShowSignup(!showSignup)}>
            {showSignup ? 'Already have an account? Login' : 'No account? Sign up'}
          </Typography>
        </Paper>
      )}

      <Snackbar open={Boolean(confirmationMessage)} autoHideDuration={4000} onClose={() => setConfirmationMessage('')}>
        <Alert severity="info">{confirmationMessage}</Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
