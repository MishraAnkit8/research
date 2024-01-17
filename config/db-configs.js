const dotenv = require('dotenv');

const autoriders_read_db = {
  host: process.env.DB_HOST_1,
  user: process.env.DB_USER_1,
  password: process.env.DB_PASS_1,
  database: process.env.DB_NAME_1,
  port: process.env.DB_PORT_1,
  max: 10,
  timezone: 'Asia/Kolkata',
  application_name: 'Research Project Read Pool',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const autoriders_write_db = {
  host: process.env.DB_HOST_1,
  user: process.env.DB_USER_1,
  password: process.env.DB_PASS_1,
  database: process.env.DB_NAME_1,
  port: process.env.DB_PORT_1,
  timezone: 'Asia/Kolkata',
  max: 5,
  application_name: 'Research Project Write Pool',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};


module.exports = { autoriders_read_db, autoriders_write_db }