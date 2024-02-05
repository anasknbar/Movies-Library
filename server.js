const express = require('express') // require(import) express from my node_modules folder
const app = express() // invoke express
const axios = require('axios');
require('dotenv').config()
const port = process.env.movie_PORT
const apiKey = process.env.API_KEY_MOVIE



app.get('/search',moviesSearchHandler)
app.get('/trending',moviesTrendingHandler)
app.get('/latestTV',latestTVHandler)
app.get('/certification',moveCerificationHandler)

function moviesSearchHandler(req,res){
  let movieName = req.query
  let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`
  axios.get(url)
  .then(result => {
    console.log(result)
    res.json(result)
  })
  .catch(err => {
    console.log(err)
    res.status(500).send('Internal Server Error')
  })
  
}

function moviesTrendingHandler(req,res){
  let url = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${apiKey}`
  axios.get(url)
  .then(result => {
    let movieMapArray = result.map(movie => {
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
          })
          console.log(movieMapArray)
          res.json(movieMapArray)
  })
  .catch(err =>{
    console.log(err)
    res.status(500).send('Internal Server Error')
  })
}

function latestTVHandler(req,res){
  let url = `https://api.themoviedb.org/3/tv/latest?api_key=${apiKey}`
  axios.get(url)
  .then(result => {
    console.log(result)
    res.json(result)
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
    console.log(result)
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