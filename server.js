const express = require('express');
const app = express();
const user = require('./src/controllers/User');

app.use(express.json());
app.use('/api/users', user);

app.get('/', (req, res) => {
  res.status(200).send('Main route');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}...`));


