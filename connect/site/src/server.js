const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://connect1:connect1@seeoh.i2jzuxi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
})
.catch(err => {
  console.log('MongoDB Connection Error:', err);
});

const ConnectionSchema = new mongoose.Schema({
  name: String,
  tags: String,
  description: String,
  linkedInURL: String,
  timestamp: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  phoneNumber: String,
  password: String,
  timestamp: { type: Date, default: Date.now }
});

const Connection = mongoose.model('Connection', ConnectionSchema);
const User = mongoose.model('User', UserSchema);

app.post('/api/addConnection', async (req, res) => {
  console.log('Received request to add connection:', req.body);
  const newConnection = new Connection(req.body);
  try {
    await newConnection.save();
    console.log('Connection added successfully');
    res.status(201).send('Connection added');
  } catch (err) {
    console.log('Error adding connection:', err);
    res.status(400).send('Error adding connection');
  }
});

app.get('/api/connections', async (req, res) => {
  try {
    const connections = await Connection.find({});
    res.status(200).json(connections);
  } catch (err) {
    console.log('Error fetching connections:', err);
    res.status(400).send('Error fetching connections');
  }
});


app.post('/api/register', async (req, res) => {
  console.log('Received request to register:', req.body);
  const { email, password } = req.body;

  if (password.length < 4) {
    console.log('Password too short');
    return res.status(400).send('Password must be at least 8 characters');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  try {
    await newUser.save();
    console.log('User registered successfully');
    res.status(201).send('User registered');
  } catch (err) {
    console.log('Error registering user:', err);
    res.status(400).send('Error registering user');
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Received request to login:', req.body);
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    console.log('User authenticated');
    res.status(200).send('Authenticated');
  } else {
    console.log('Unauthorized access attempt');
    res.status(401).send('Unauthorized');
  }
});

const port = 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

module.exports = {Connection, User};

