const express = require('express');
const app = express();
const user = require('./src/controllers/User');
const exercise = require('./src/controllers/Exercise');
const set = require('./src/controllers/Set');
const ping = require('./src/controllers/Ping');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/api/users', user);
app.use('/api/exercises', exercise);
app.use('/api/sets', set);
app.use('/api/ping', ping);

app.get('/', (req, res) => {
  res.status(200).send('Main route');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}...`));
