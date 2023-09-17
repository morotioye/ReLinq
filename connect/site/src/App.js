import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Container, Typography, Snackbar, Paper, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  title: {
    fontWeight: 'bold',
  },
  paper: {
    padding: '20px',
    textAlign: 'center',
    display: 'inline-block',
  },
});

function App() {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAddConnection, setShowAddConnection] = useState(false);
  const [loginData, setLoginData] = useState({ phoneNumber: '', password: '' });
  const [signupData, setSignupData] = useState({ phoneNumber: '', password: '' });
  const [connections, setConnections] = useState([]);
  const [formData, setFormData] = useState({
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

  const handleSignup = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/register', signupData);
      if (res.status === 201) {
        setIsLoggedIn(true);
        setConfirmationMessage('Signed up successfully');
      }
    } catch (error) {
      setConfirmationMessage('Signup failed');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/login', loginData);
      if (res.status === 200) {
        setIsLoggedIn(true);
        setConfirmationMessage('Logged in successfully');
      }
    } catch (error) {
      setConfirmationMessage('Login failed');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/addConnection', formData);
      if (res.status === 201) {
        setConfirmationMessage('Connection added successfully');
        setConnections([...connections, formData]);
        setShowAddConnection(false);
      }
    } catch (error) {
      setConfirmationMessage('Failed to add connection');
    }
  };
  

  return (
    <Container>
      <Typography variant="h3" className={classes.title}>Relinq</Typography>
      <Typography variant="subtitle1">Reconnecting you with those that matter.</Typography>
      {isLoggedIn ? (
        <div>
          <Button variant="contained" color="primary" onClick={() => setShowAddConnection(!showAddConnection)}>
            {showAddConnection ? 'Cancel' : 'Add New Connection'}
          </Button>
          {showAddConnection && (
            <form onSubmit={handleSubmit}>
              <TextField label="Name" variant="outlined" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <TextField label="Tags" variant="outlined" onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
              <TextField label="Description" variant="outlined" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <TextField label="LinkedIn URL" variant="outlined" onChange={(e) => setFormData({ ...formData, linkedInURL: e.target.value })} />
              <Button variant="contained" color="primary" type="submit">Add</Button>
            </form>
          )}
          <div>
            {connections.map((connection, index) => (
              <Paper elevation={3} key={index}>
                <Typography variant="h4">{connection.name}</Typography>
                <Typography variant="body1">{connection.tags}</Typography>
                <Typography variant="body2">{connection.description}</Typography>
                <Typography variant="body2">{connection.linkedInURL}</Typography>
              </Paper>
            ))}
          </div>
        </div>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
          <Paper elevation={3} className={classes.paper}>
            {showSignup ? (
              <div>
                <Typography variant="h4">Sign Up</Typography>
                <TextField label="Phone Number" variant="outlined" onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })} />
                <TextField label="Password" variant="outlined" type="password" onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                <Button variant="contained" color="primary" onClick={handleSignup}>Sign Up</Button>
              </div>
            ) : (
              <div>
                <Typography variant="h4">Login</Typography>
                <TextField label="Phone Number" variant="outlined" onChange={(e) => setLoginData({ ...loginData, phoneNumber: e.target.value })} />
                <TextField label="Password" variant="outlined" type="password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
              </div>
            )}
            <Button variant="text" color="primary" onClick={() => setShowSignup(!showSignup)}>
              {showSignup ? 'Already have an account? Login' : 'No account? Sign up'}
            </Button>
          </Paper>
        </Box>
      )}
      <Snackbar open={Boolean(confirmationMessage)} autoHideDuration={4000} message={confirmationMessage} />
    </Container>
  );
}

export default App;
