'use strict';


//Load environment variables from the .env file
require('dotenv').config();

// Step 1:  Bring in our modules/dependencies
const express = require('express');
const app = express();
const cors = require('cors');
require('ejs');
const superagent = require('superagent');
const pg = require('pg');

const methodOverride = require('method-override');


// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });



// Step 2:  Set up our application

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// declare port for server
const PORT = process.env.PORT || 3000;


//routes
// app.get('/index', homeHandler);
app.get('/', homePage);
app.get('/new', searchSong
app.post('/searches', searchHandler);
app.post('/books', addBookToDatabase);
app.get('/books/:book_id', singleBookHandler)
app.delete('/update/:book_id', deleteBook);
app.get('*', errHandler);

// constuctor functions
function searchSong(request, response) {
  console.log(request.body);
  const searchQuery = request.body.searchQuery;
  const searchType = request.body.searchType;
  console.log(request.body);
  let URL = `https://api.deezer.com/search?q=artist:"aloe blacc"`;
  if (searchType === 'title') { URL += `+intitle:${searchQuery}`; }
  if (searchType === 'author') { URL += `+inauthor:${searchQuery}`; }
  console.log('URL', URL);
  superagent.get(URL)
    .then(data => {
      console.log(data.body.items[1]);
      const yourArtist = data.body.items;
      const listOfartist = yourArtist.map(artists => new Artist(artists.artist.name));
      response.render('searches/show', { renderContent: listOfartist });
    });

}
//Book Construtor

function Book(book) {
  this.title = book.title ? book.title : 'no title found';
  this.description = book.description ? book.description : 'no description found';
  this.authors = book.authors ? book.authors[0] : 'no author found';
  this.isbn = book.industryIdentifiers;
  //splice method
  //
  console.log('url', URL);
}




function errHandler(request, response) {
  response.status(404).render('pages/error');
}


client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App Listening on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.log(error);
  });


// app.listen(PORT, () => {
//   console.log(`now listening on port ${PORT}`);
// });

// Connect to DB and Start the Web Server
client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server up on', PORT);
      console.log(`Connected to database ${client.connectionParameters.database}`);
    });
  })
  .catch(err => {
    console.log('ERROR', err);
  });

