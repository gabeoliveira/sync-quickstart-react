const express = require('express');
const session = require('express-session')
const cors = require('cors');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const tokenGenerator = require('./token_generator');

// load configuration from .env if available
require('dotenv').config();

const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use(session(
  {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: 'auto',
      httpOnly: true,
      maxAge: 86400000
    }
  })
);


app.get('/token/:id?', (req, res) => {
  const id = req.params.id;
  res.send(tokenGenerator(id));
});

app.post('/token', (req, res) => {
  const id = req.body.id;
  res.send(tokenGenerator(id));
});


app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let port = process.env.PORT || 5000;
console.log(`Listening on port ${port}`);
app.listen(port);

// Routes
app.use('/api/discord', require('./api/discord'));
app.use('/user', require('./api/user'));
app.use('/logout', require('./api/logout'));



