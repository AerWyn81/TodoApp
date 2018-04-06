const Sequelize = require('sequelize')
const db = require('../database/db')

const Users = db.define('users', {
     nom: {
       type: Sequelize.STRING,
       allowNull: false
       },
     prenom: {
        type: Sequelize.STRING,
        allowNull: false
        },
     email: {
          type: Sequelize.STRING,
          allowNull: false
          },
     password: {
        type: Sequelize.STRING,
        allowNull: false
      },
});

db.sync()

module.exports = Users