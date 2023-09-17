const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const accountSid = 'sid';
const authToken = 'token';
const client = new twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = [];
let connections = [];

const exampleMessages = require('./examples.json'); // Assuming examples.json is in the same directory

app.post('/api/register', (req, res) => {
  const { phoneNumber, password } = req.body;
  users.push({ phoneNumber, password });
  res.status(201).send('User registered');
});

app.post('/api/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = users.find(u => u.phoneNumber === phoneNumber && u.password === password);
  if (user) {
    const randomIndex = Math.floor(Math.random() * exampleMessages.length);
    const randomMessage = exampleMessages[randomIndex];
    try {
      await client.messages.create({
        body: randomMessage,
        to: phoneNumber,
        from: 'your_twilio_phone_number'
      });
      res.status(200).send('Logged in');
    } catch (error) {
      res.status(500).send('Failed to send SMS');
    }
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
