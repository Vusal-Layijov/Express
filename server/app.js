const express = require('express');
const app = express();

require('express-async-errors')
require('dotenv').config()



const dogs = require('./routes/dogs')

app.use(express.json())
app.use('/static', express.static('assets'))
app.use('/dogs', dogs)



app.use( (req,res, next)=>{
  const method = req.method
  const url = req.url
  console.log(method,url)
  res.on('finish', () => {
    // read and log the status code of the response
    console.log(res.statusCode)
  });
  next();
})








// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});
app.use((req,res,next)=>{
  const err = new Error('The requested resource couldnt be found')
  err.statusCode=404; 
  next(err)
})


app.use((err, req, res, next) => {
  console.log(err)
  const status = err.statusCode || 500

  if(!(process.env.NODE_ENV === 'production')){
    res.json({
      "message": err.message || 'Something went wrong',
      "statusCode": status,
      "stack": err.stack
    }) } else {
      res.json({
        "message": err.message || 'Something went wrong',
        "statusCode": status
      })
    }
  

})


const port = process.env.PORT;
app.listen(port, () => console.log('Server is listening on port', port));