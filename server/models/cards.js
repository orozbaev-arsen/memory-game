module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('cards', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    card: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true,
  });
  /* eslint-disable func-names */
  Model.associate = function (models) {
    this.belongsTo(models.games, {
      foreignKey: 'game_id',
      onDelete: 'CASCADE',
    });
  };
  return Model;
};
