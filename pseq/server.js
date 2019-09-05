const express = require('express')
const Sequelize = require('sequelize')

const app = express();
const port = 8081;

const connection =  new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false
})

const User = connection.define('User', {
  name: Sequelize.STRING,
  bio: Sequelize.TEXT
});

connection
  .sync({
    logging: console.log
  })
  .then(() => {
    User.create({
      name: 'Jude',
      bio: 'Am a dev'
    })
  })
  .then(() => {
  console.log('Connected to DB');
}).catch((err) => {
  console.log(`Failled to connect to db: error = ${err}`);
})


app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
