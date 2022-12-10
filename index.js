
require('dotenv').config();
const express = require('express')
const app =  express()
const path = require('path')
const cors = require('cors')
const corsOption = require('./config/corsOptions')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500

//connect db
connectDB();

// custom middleware logger
app.use(logger)

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOption))

// build-in middleware to handle urlencoded data
// in other word, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}))

// build-in middleware for json
app.use(express.json())

// middleware for cookie
app.use(cookieParser())

// serve static file
app.use(express.static(path.join(__dirname,'/public')))

// using router
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh',require('./routes/refresh'))
app.use('/logout', require('./routes/logout'));


// node follows waterfall method
// so this will only work for the route below this
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

// customizing 404 error
app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
       res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({error: '404 Not found'})
     } else {
        res.type('txt').send('404 Not Found')
     }  
})


// custom error
app.use(errorHandler)

mongoose.connection.once('open',()=>{
   console.log("Connected to mongo db")
   app.listen(PORT, ()=> console.log(`Server running: http://localhost:${PORT}`))
})

