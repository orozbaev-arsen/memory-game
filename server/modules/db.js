const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

module.exports = async (app, config) => {
  const sequelize = new Sequelize(config.database || 'memory', config.username || 'root', config.password || '', {
    host: config.host || 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  });
  await sequelize.authenticate();

  const models = {};
  fs.readdirSync(app.dir('models'))
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .forEach((file) => {
      const model = sequelize.import(app.dir(path.join('models', file)));
      console.log('loading model', model.name);
      models[model.name] = model;
    });

  Object.keys(models).forEach((modelName) => {
    if (models[modelName].hasOwnProperty('associate')) {
      models[modelName].associate(models);
    }
  });

  return models;
};
