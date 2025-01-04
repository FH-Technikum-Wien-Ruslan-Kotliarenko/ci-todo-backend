const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('todo', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    done: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users', // Reference by table name, not the object
        key: 'id'
      }
    }
  });
};
