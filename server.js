const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.post('/msg', (req, res) => {
    console.log(req.body);
    res.status(200).send(req.body);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
