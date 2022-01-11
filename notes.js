const { Server } = require("http");

/*
extensions we'll need:
    - bracket pair colorizer
    - ES7/react/redux blabla
    - Prettier 
Setting git bash as default vscode terminal:
    - click on the arrow icon on right side of plus button in the terminal tab, select "Set Default Profile", restart the vs code and you will see git bash as default terminal.
Set up mongodb atlas
Project setup - installing dependencies
    - npm init
    - dependencies: express express-validator bcryptjs config gravatar jsonwebtoken mongoose request
    - dev dependencies (npm i -D): nodemon concurrently
*/

/********/
Server.js;
/********/
const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;     // process.env.PORT means that WHEN DEPLOYED on a live server, it will look for the specific port and run on that otherwise, locally, it will run on port 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);       // WYAK: es6 veriables - back ticks
});

/********/
package.json;
/*******
"scripts": {
    "start": "node server", // we will use this while deploying to heroku - heroku runs this comand
    "server": "nodemon server" // local project will use this as "npm run server"
}
*/

