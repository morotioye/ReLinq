import express from "express";

const express = require('express');
const router = express.Router();
const { UserDao } = require('./UserDAO'); // Adjust the path as needed
const { ConnectionDao } = require('./ConnectionDAO'); // Adjust the path as needed

// POST route to add a User to a Connection
router.post('/add-user-to-connection', async (req, res) => {
  try {
    // Get user and connection details from the request body
    const { userEmail, connectionEmail } = req.body;

    // Find the User and Connection by email
    const user = await UserDao.findUserByEmail(userEmail);
    const connection = await ConnectionDao.findConnectionByEmail(connectionEmail);

    // Check if both User and Connection exist
    if (!user || !connection) {
      return res.status(404).json({ message: 'User or Connection not found' });
    }

    // Add the User to the Connection (you may need to adjust your data structure)
    connection.users.push(user._id); // Assuming you have a 'users' field in Connection

    // Save the updated Connection
    await connection.save();

    res.status(200).json({ message: 'User added to Connection successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;