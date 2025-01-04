const { Sequelize } = require('sequelize');

// Construct the connection URL
const connUrl = 
  process.env.DB_DIALECT + '://' +
  process.env.DB_USER + ':' +
  process.env.DB_PW + '@' +
  process.env.DB_HOST + '/' +
  process.env.DB_NAME;

const db = new Sequelize(connUrl, {
  logging: console.log, // Enable SQL logging for debugging
  dialectOptions: {
    // Add additional options if needed for MariaDB
  },
});

// Import models
const models = [
  require('../models/todo'),
  require('../models/user'),
];

// Initialize models
for (const model of models) {
  model(db); // Pass the Sequelize instance
}

// Set up associations (if any) after models are initialized
const { todo, user } = db.models;
user.hasMany(todo, { foreignKey: 'userId' });
todo.belongsTo(user, { foreignKey: 'userId' });

module.exports = db;
