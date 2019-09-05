const express = require('express')
const Sequelize = require('sequelize')
const _USERS = require('./users.json')

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
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true
    }
  }

});

app.post('/post', (req, res) => {
  const newUser = req.body.user
  User.create({
    newUser
  }).then(user => {
    res.json(user)
  }).catch((err) =>{
    console.log(err);
    res.status(404).send(err)
  })
})

connection
  .sync({
    logging: console.log,
    force: true
  })
  .then(() => {
    User.bulkCreate(_USERS).then(() => {
      console.log('Successfully created the users')
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
