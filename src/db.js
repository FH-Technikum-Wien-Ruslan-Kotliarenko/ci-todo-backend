const { Sequelize } = require('sequelize');

const { DB_DIALECT = 'mariadb', DB_USER, DB_PW, DB_HOST, DB_NAME } = process.env;

const connUrl = `${DB_DIALECT}://${DB_USER}:${DB_PW}@${DB_HOST}/${DB_NAME}`;

console.log('DB URL:', connUrl);

const sequelize = new Sequelize(connUrl, {
  logging: console.log,
  dialectOptions: {
    // add RDS SSL options here if required by your instance
  }
});

// Models
require('./models/item')(sequelize);
require('./models/apikey')(sequelize);

module.exports = sequelize;
