// models/todo.js
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
    }
  });

  // At runtime, you can associate user -> todos in a small "init" step:
  // If you have a "user" model loaded, you can do:
  // Todo.belongsTo(sequelize.models.user, { foreignKey: 'userId' });
  // That means each todo row references the user that created it.
};
