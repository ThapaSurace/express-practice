const express = require('express')
const router = express.Router()
const path = require('path')


// we can use regex so ...index.html cane be acess
// by putting / or index.html or index only
// (.html)? makes it optional to add .html 
router.get('^/$|index(.html)?',(req,res)=>{
    // res.sendFile('./file/index.html',{root: __dirname})
    res.sendFile(path.join(__dirname,'..','views','index.html'))
})


module.exports = router