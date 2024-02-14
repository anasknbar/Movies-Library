const express = require('express') // require(import) express from my node_modules folder
const app = express() // invoke express
const cors = require('cors')
app.use(cors());
const axios = require('axios');
require('dotenv').config()
const moveData = require('./MoveData/data.json') // import data, this is from Lab11

const port = process.env.PORT 
const apiKey = process.env.API_KEY

//_____database setup__________
const { Client } = require('pg')
// url rules > postgres://username:password@localhost:5432/databasename
const url = `postgres://anas:${process.env.dbPassword}@localhost:5432/mydb` // my database url that I want to conect the server with.
const client = new Client(url)

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//_____________ DataBase Routes ______________________

app.get('/getMovies',getMovies)
app.post('/addMovie', addMovieHandler)


app.patch('/UPDATE/:id', updateMovieHandler)
app.delete('/DELETE/:id',deleteMovieHandler)
app.get('/getMovie/:id', getMovieByIdHandler);

//________________ DataBase Handlers _________________
function getMovies(req,res){
  const sql = 'SELECT * FROM movie;'
  client.query(sql).then((response)=>{
    const data =  response.rows
    res.status(200).json(data)
  }).catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }) 
}

function addMovieHandler(req, res) {
 

  const { title, time, date_of_release, overview, comment } = req.body
  const sql = `INSERT INTO movie  (title, time, date_of_release, overview, comment)
  VALUES ($1, $2, $3, $4, $5) RETURNING * ; ` // more secure approach
  const values = [title, time, date_of_release, overview, comment]
  client.query(sql,values).then((response)=>{
     
    res.status(201).send(response.rows)
  }).catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }) 
}

function updateMovieHandler(req,res){
   
  const dataId = req.params.id
  const {comment} = req.body

  const sql = `UPDATE movie 
  SET comment=$1
  WHERE  movie_id=$2`
  const values = [comment, dataId]
  client.query(sql,values)
  .then( respose => {
    res.send('comment updated succefully')
    
  })
  .catch(err => {
    console.log(err)
    res.status(500).send('internal service error')
  })
}

function deleteMovieHandler(req,res){

  const dataId = req.params.id 
  const sql = `DELETE FROM movie
  WHERE  movie_id=$1;`
  
  client.query(sql,[dataId])
  .then( () => {
    res.send('move data has been deleted')
  })
  .catch(err => {
    console.log(err)
    res.status(500).send('internal service error')
  })
}

function getMovieByIdHandler(req,res){
  const dataId = req.params.id
  
  const sql = `SELECT * FROM movie 
  WHERE movie_id = $1;` 
  client.query(sql,[dataId])
  .then((response) => {
    res.json(response.rows)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send('internal service error')
  })
}



//________________ API Routes ________________________
app.get('/',homePageHandler)
app.get('/favorite',favoritePageHandler)


app.get('/trending',moviesTrendingHandler)
app.get('/search',moviesSearchHandler)

app.get('/latestTV',latestTVHandler)
app.get('/certification',moveCerificationHandler)



//_____________ API Handlers __________________________

function favoritePageHandler(req, res) {
  res.send('Welcome to Favorite Page')

}

function homePageHandler(req,res){
  const requiredMove = new MoveFromMydb(moveData.title,moveData.poster_path,moveData.overview)
  res.json(requiredMove)
 }

function moviesTrendingHandler(req,res){
  let url = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}`
  
  axios.get(url)
  .then( result => {
    let movieData = result.data.results
   
    const moviesArray = movieData.map(movie => {
      return  new MovieFromApi(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
    })
    res.json(moviesArray)
    console.log(moviesArray)
    
  
}
  )
  .catch(err => {
    console.log(err)
    res.status(500).send('Internal Server Error')
  })

 
}


function moviesSearchHandler(req,res){
  let movieName = req.query.movieName
  let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`
  axios.get(url)
  .then(result => {
    let movieData = result.data.results
    console.log(movieData)
    res.json(movieData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send('Internal Server Error')
  })
  
}

function latestTVHandler(req,res){
  let url = `https://api.themoviedb.org/3/tv/latest?api_key=${apiKey}`
  axios.get(url)
  .then(result => {
    let movieData = result.data.results
    console.log(movieData)
    res.json(movieData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send('Internal Server Error')
  })
}
function moveCerificationHandler(req,res){
  let url = `https://api.themoviedb.org/3/certification/movie/list?api_key=${apiKey}`
  axios.get(url)
  .then( result => {
    let movieData = result.data.results
    res.json(movieData)
    console.log(movieData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send('Internal Server Error')
  })
}




function MovieFromApi(id, title, release_date, poster_path, overview) {
  this.id = id
  this.title = title
  this.release_date = release_date
  this.poster_path = poster_path
  this.overview = overview
}

function MoveFromMydb(title,posterPath,overview){
  this.title = title
  this.posterPath = posterPath
  this.overview = overview
 }


app.use((req, res, next) => {
  res.status(404).send('404 not found')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})


client.connect().then(() => {
  app.listen(port, () => {
    console.log(`movie app listening on port ${port}`)
  })
}).catch()   // to make sure that the DB is connected to my server
