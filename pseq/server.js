const express = require('express')
const Sequelize = require('sequelize')
const _USERS = require('./users.json')

const Op = Sequelize.Op;

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

app.get('/findall', (req, res) => {
  User.findAll({
    where: {
      name: {
        [Op.like]: 'Dav%'
      }
    }
  }).then(user => {
    res.json(user)
  }).catch((err) =>{
    console.log(err);
    res.status(404).send(err)
  });
})

app.get('/findone', (req, res) => {
  User.findByPk('55').then(user => {
    res.json(user)
  }).catch((err) =>{
    console.log(err);
    res.status(404).send(err)
  });
})

app.put('/update', (req, res) => {
  User.update({ name: 'jude', password: 'password'}, {
    where: { id: 1 }
  }).then(rows => {
    res.json(rows)
  }).catch((err) =>{
    console.log(err);
    res.status(404).send(err)
  });
})

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
