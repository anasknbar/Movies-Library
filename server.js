const express = require('express') // require(import) express from my node_modules folder
const app = express() // invoke express
const cors = require('cors')
app.use(cors());
const axios = require('axios');
require('dotenv').config()

const moveData = require('./MoveData/data.json') // import data
const port = process.env.PORT
const apiKey = process.env.API_KEY

//_________________________________


//_________________________________

app.get('/favorite',favoritePageHandler)

app.get('/trending',moviesTrendingHandler)
app.get('/search',moviesSearchHandler)

app.get('/latestTV',latestTVHandler)
app.get('/certification',moveCerificationHandler)


 function favoritePageHandler(req,res){
  res.send('Welcome to Favorite Page')
  
 }



function moviesTrendingHandler(req,res){
  let url = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}`
  
  axios.get(url)
  .then( result => {
    let movieData = result.data.results
   
    const moviesArray = movieData.map(movie => {
      return  new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
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
  let movieName = req.query
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


function Movie(id,title,release_date,poster_path,overview){
  this.id = id
  this.title = title
  this.release_date = release_date
  this.poster_path = poster_path
  this.overview = overview
}

app.use((req,res,next)=>{
  res.status(404).send('404 not found')
})
  
app.use((err,req,res,next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})



app.listen(port, () => {
  console.log(`movie app listening on port ${port}`)
})