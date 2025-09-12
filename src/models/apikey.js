const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'ApiKey',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      hash: { type: DataTypes.STRING(200), allowNull: false },
      revokedAt: { type: DataTypes.DATE, allowNull: true }
    },
    {
      tableName: 'api_keys',
      indexes: [{ fields: ['revokedAt'] }]
    }
  );
};
