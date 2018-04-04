const Sequelize = require('sequelize')
const db = require('../database/db')

const Todo = db.define('todo', {
     nom: {
       type: Sequelize.STRING,
       allowNull: false
       },
     description: {
        type: Sequelize.STRING,
        allowNull: false
      },
     completion: {
       type: Sequelize.BOOLEAN,
       allowNull: false,
       defaultValue: false
       },
     createdAt: {
       type: Sequelize.DATE,
       allowNull: false,
       defaultValue: Date.now()
     },
     updatedAt: {
       type: Sequelize.DATE,
       allowNull: true,
       defaultValue: null
     }
});

db.sync()

module.exports = Todo