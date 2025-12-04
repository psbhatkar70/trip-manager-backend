const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to Database
mongoose.connect(process.env.DATABASE)
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.log('DB Connection Error:', err));

// Start Server

app.listen(3000, () => {
  console.log(`App running on port 3000`);
});