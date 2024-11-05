const express = require('express');
const mongoose = require('mongoose');
const permissionsRoute = require('./routes/permissions'); // Path to the route file

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api', permissionsRoute); // Route prefix

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running');
    });
  })
  .catch(error => console.error('Database connection error:', error));