const bodyParser = require('body-parser');
const express = require('express');
const connectDB = require('./config/db'); // we are importing the funciton as default from db.js that's why we can call it whatever we want


const app = express();

app.get('/',(req,res)=>{
    res.send("API Running");
})

//middleware
// old method
// app.use(bodyParser({extended:false}));  
// new method
app.use(express.urlencoded({extended: true}));  
app.use(express.json()) // To parse the incoming requests with JSON payloads
// Define Routes
app.use('/api/users',require("./routes/api/users"));
app.use('/api/auth',require("./routes/api/auth"));
app.use('/api/profile',require("./routes/api/profile"));
app.use('/api/posts',require("./routes/api/posts"));

// Databse Connection
connectDB();        // calling the funciton as it is already defined in db.js

const PORT = process.env.PORT || 5000;     // process.env.PORT means that WHEN DEPLOYED on a live server, it will look for the specific port and run on that otherwise, locally, it will run on port 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);       // WYAK: es6 veriables - back ticks
})