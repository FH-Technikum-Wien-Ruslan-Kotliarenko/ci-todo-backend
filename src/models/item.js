const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Item',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: 'items',
      indexes: [
        { fields: ['createdAt'] }, // for newest/oldest sort
        { fields: ['name'] } // crude help for LIKE
      ]
    }
  );
};
