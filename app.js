const express = require('express');
const app = express();
const cors = require('cors');



app.use(cors());
app.use(express.json());
const carRoutes=require('./routes/carRoutes');
const tripRoutes=require('./routes/tripRoutes');
const userRoutes=require('./routes/userRoutes');

app.get('/ping', (req, res) => {
  res.status(200).send('Pong');
});


app.use('/api/v1/cars',carRoutes);
app.use('/api/v1/trips',tripRoutes);
app.use('/api/v1/user',userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

module.exports = app;