const express = require('express')
const Sequelize = require('sequelize')

const app = express();
const port = 8081;

const connection =  new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false,
  define: {
    freezeTableName: true
  }
})

const User = connection.define('User', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: Sequelize.STRING,
  bio: Sequelize.TEXT,

}, {
  timestamps: false
});

connection
  .sync({
    logging: console.log,
    force: true
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
