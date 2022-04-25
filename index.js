const express = require('express'),
      morgan = require('morgan'),
      fs = require('fs'),
      path = require('path');

const app = express();

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let users = [
  {
    id: 1,
    name: "Mitchell",
    favouriteMovies: []
  },
  {
    id: 2,
    name: "Sadaf",
    favouriteMovies: ["Justice League Zack Snyder Cut"]
  }
]

let topMovies = [
  {
    title: 'Jutice League Zack Snyder Cut',
    director: 'Zack Snyder',
    genre: {
      name: 'Superhero',
      description: 'Superhero fiction is a genre of speculative fiction examining the adventures, personalities and ethics of costumed crime fighters known as superheroes, who often possess superhuman powers and battle similarly powered criminals known as supervillains.'
    }
  },
  {
    title: 'Licorice Pizza',
    director: 'Paul Thomas Anderson',
    genre: {
      name: 'Comedy',
      description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter'
    }
  },
  {
    title: 'Dune',
    director: 'Denis Villeneuve',
    genre: {
      name: 'Sci-fi',
      description: 'Science fiction, also often known as sci-fi, is a genre of literature that is imaginative and based around science. It relies heavily on scientific facts, theories, and principles as support for its settings, characters, themes, and plot.'
    }
  },
  {
    title: 'Spider-Man: No Way Home',
    director: 'Jon Watts',
    genre: {
      name: 'Superhero',
      description: 'Superhero fiction is a genre of speculative fiction examining the adventures, personalities and ethics of costumed crime fighters known as superheroes, who often possess superhuman powers and battle similarly powered criminals known as supervillains.'
    }
  },
  {
    title: 'Undine',
    director: 'Christian Petzold',
    genre: {
      name: 'Romance',
      description: 'Romance genre stories involve chivalry and often adventure. The prevailing type of story in the romance genre consists of a love relationship between a man and a woman, often from the womans point of view. There is always conflict that hinders the relationship, but is resolved to a happy ending.'
    }
  },
  {
    title: 'King Richard',
    director: 'Reinaldo Marcus Green',
    genre: {
      name: 'Sports',
      description: 'Sports Fiction Genre – Whats the best definition for sports genre? Books in the sports fiction genre are made up of stories where a sport has an impact on the plot or main character. The story could be about a coach who struggles with life and finds peace and comfort when hes with the team and the game.'
    }
  },
  {
    title: 'Mass',
    director: 'Franz Kranz',
    genre: {
      name: 'Drama',
      description: 'Drama: The drama genre features stories with high stakes and a lot of conflicts. Theyre plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters.'
  }
  },
  {
    title: 'Identifying Features',
    director: 'Fernanda Valadez',
    genre: {
      name: 'Drama',
      description: 'Drama: The drama genre features stories with high stakes and a lot of conflicts. Theyre plot-driven and demand that every character and scene move the story forward. Dramas follow a clearly defined narrative plot structure, portraying real-life scenarios or extreme situations with emotionally-driven characters.'
  }
  },
  {
    title: 'Nightmare Alley',
    director: 'Guillermo del Toro',
    genre: {
      name: 'Thriller',
      description: 'Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.'
    }
  },
  {
    title: 'Parallel Mothers',
    director: 'Pedro Almodovar',
    genre: {
      name: 'Comedy',
      description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter'
    }
  }
];

const bodyParser = require('body-parser'),
  methodOverride = require('method-override')
  uuid = require('uuid');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// READ
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/', (req, res) => {
  res.send('Welcome to my movie catalogue!');
});

app.get('/movies/:title', (req,res) => {
  res.json(topMovies.find((movie) =>
  {return movie.title === req.params.title}));
});

app.get('/movies/genre/:genreName', (req,res) => {
  const {genreName} = req.params;
  const genre = topMovies.find(movie => movie.genre.name === genreName).genre;

  if(genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre');
  }
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies/directors/:directorName', (req,res) => {
  res.json(topMovies.find((movie) =>
  {return movie.director === req.params.directorName}));
});
//END READ
//CREATE

app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else{
    res.status(400).send('users need names');
  }
});

app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if(user) {
    user.favouriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array'`);
  } else {
    res.status(400).send('no such user');
  }
});

//END CREATE
//UPDATE

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if(user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
});

//END UPDATE
//DELETE

app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if(user) {
    user.favouriteMovies = user.favouriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array'`);
  } else {
    res.status(400).send('no such user');
  }
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if(user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user');
  }
});
