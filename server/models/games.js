module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('games', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    game: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    errors: {
      type: DataTypes.INTEGER,
      default: 0,
      allowNull: false,
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
  return Model;
};
