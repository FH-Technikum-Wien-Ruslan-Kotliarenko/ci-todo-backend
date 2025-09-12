const { Sequelize } = require('sequelize');

const connUrl =
  process.env.DB_DIALECT +
  '://' +
  process.env.DB_USER +
  ':' +
  process.env.DB_PW +
  '@' +
  process.env.DB_HOST +
  '/' +
  process.env.DB_NAME;

const sequelize = new Sequelize(connUrl, {
  logging: false,
  dialectOptions: {
    // add RDS SSL options here if required by your instance
  }
});

// Models
require('./models/item')(sequelize);
require('./models/apikey')(sequelize);

module.exports = sequelize;
