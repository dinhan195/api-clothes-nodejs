/** @format */

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('store', 'root', process.env.MYSQL_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});
const connectionDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
connectionDatabase();