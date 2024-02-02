'use strict';

const express = require('express') // require(import) express from my node_modules folder
const app = express() // invoke express
const port = 3000

const moveData = require('./MoveData/data.json') // import data


 app.get('/',moveHandler)

 function moveHandler(req,res){
  const requiredMove = new Move(moveData.title,moveData.poster_path,moveData.overview)
  res.json(requiredMove)
 }

 app.get('/favorite',favoritePageHandler)

 function favoritePageHandler(req,res){
  res.send('Welcome to Favorite Page')
  
 }

//handling error 
 app.get('*', handle404Erorr) 
  function handle404Erorr(req,res){

     res.status(404).send( 
      `{

      "status": 404,
      "responseText": "Sorry, the requested page was not found!"
  
      }`
      
     )}



app.get('/simulate-500-route',handle500Erorr) 
function handle500Erorr(req,res){

   res.status(500).send(
    `{

    "status": 500,
    "responseText": "Sorry, something went wrong"

    }`
    
    );}

 function Move(title,posterPath,overview){
  this.title = title
  this.posterPath = posterPath
  this.overview = overview
 }


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

