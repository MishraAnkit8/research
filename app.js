const express = require('express');
const useragent = require('express-useragent');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
//  const { customErrorHandler } = require('./utils/error-handler');
// const { requestLogger, addRequestId, attachChildLogger } = require('./src/middleware/logger');
const router = require('./src/routes/index.route');

dotenv.config(); // Load environment variables from a .env file if present

const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

//For using static file 
app.use(express.static('public'));

// Middleware to set payload type and limit
app.use(express.json({ limit: process.env.PAYLOAD_SIZE_LIMIT }));
app.use(express.urlencoded({
  extended: true,
  limit: process.env.PAYLOAD_SIZE_LIMIT,
}));
app.use(useragent.express());

// Request logger
// app.use(addRequestId);
// app.use(requestLogger);
// app.use(attachChildLogger);

// Middleware for handling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
  next();
});

// Middleware for parsing cookies with a secret
app.use(cookieParser(process.env.COOKIE_SECRET));


// Register your routes and error handler
app.use(router);
// app.use(customErrorHandler);

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
