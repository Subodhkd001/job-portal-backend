// imports
const express = require('express');

// rest object
const app = express();


// routes
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Job Portal");
})

// listen
app.listen(8080, () =>{
    console.log("server running at port 8080")
})

