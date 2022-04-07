const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path');

const app = express();

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let topMovies = [
  {
    title: 'Jutice League Zack Snyder Cut',
    director: 'Zack Snyder'
  },
  {
    title: 'Licorice Pizza',
    director: 'Paul Thomas Anderson'
  },
  {
    title: 'Dune',
    director: 'Denis Villeneuve'
  },
  {
    title: 'Spider-Man: No Way Home',
    director: 'Jon Watts'
  },
  {
    title: 'Undine',
    director: 'Christian Petzold'
  },
  {
    title: 'King Richard',
    director: 'Reinaldo Marcus Green'
  },
  {
    title: 'Mass',
    director: 'Franz Kranz'
  },
  {
    title: 'Identifying Features',
    director: 'Fernanda Valadez'
  },
  {
    title: 'Nightmare Alley',
    director: 'Guillermo del Toro'
  },
  {
    title: 'Parallel Mothers',
    director: 'Pedro Almodovar'
  }
];

const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use(morgan('combiend', {stream: accessLogStream}));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movie catalogue!');
});

// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname });
// });
