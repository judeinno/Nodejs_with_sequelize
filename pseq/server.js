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
  first: Sequelize.STRING,
  last: Sequelize.STRING,
  full_name: Sequelize.STRING,
  bio: Sequelize.TEXT,

}, {
  hooks: {
    beforeValidate: () => {
      console.log('Before Validate');
    },
    afterValidate: () => {
      console.log('after Validate');
    },
    beforeCreate: (user) => {
      user.full_name = `${user.first} ${user.last}`
      console.log('before Create');
    },
    afterCreate: () => {
      console.log('after Create');
    },
  }
});

app.get('/', (req, res) => {
  User.create({
    name: 'Jude',
    bio: 'Am a dev foo'
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
    User.create({
      first: 'Jude',
      last: 'Jude',
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
