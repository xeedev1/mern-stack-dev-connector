const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;     // process.env.PORT means that WHEN DEPLOYED on a live server, it will look for the specific port and run on that otherwise, locally, it will run on port 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);       // WYAK: es6 veriables - back ticks
})