// importing server
const server = require('./server.js'); 

// uses port 5000 for development, .env for production
const PORT = 5000 || process.env.PORT; 

// display a log for our live server
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`)); 