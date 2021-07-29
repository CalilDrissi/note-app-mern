const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

// initialize the app
const app = express();

// Establish DB connection
connectDB();

// middleware json handling config
app.use(express.json({extend: false}));


// Assign a port
const PORT = process.env.PORT || 8000;

// Defining the Routes endpoints
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


// Serving static assets for production 
app.get('/', (req, res)=> {
    res.send("You Just Hit The Home Page")
})


//Running the app
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});
