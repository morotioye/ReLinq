const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [];
let connections = [];

app.post('/api/register', (req, res) => {
  const { phoneNumber, password } = req.body;
  users.push({ phoneNumber, password });
  res.status(201).send('User registered');
});

app.post('/api/login', (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = users.find(u => u.phoneNumber === phoneNumber && u.password === password);
  if (user) {
    res.status(200).send('Logged in');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.post('/api/addConnection', (req, res) => {
  const { name, tags, description, linkedInURL, senderName } = req.body;
  connections.push({ name, tags, description, linkedInURL, senderName });
  res.status(201).send('Connection added');
});

app.get('/api/connections', (req, res) => {
  res.status(200).send(connections);
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001/');
});
