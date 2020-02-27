require('dotenv').config();

module.exports = {
  "development": {
    "username": "root",
    "password": "asdfasdf",
    "database": "mpg",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "asdfasdf",
    "database": "mpg_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "mpg",
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "pool": {
      "max": 15,
      "min": 1,
      "idle": 10000
    }
  }
};
