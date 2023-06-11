/** @format */

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Products', 'filename', Sequelize.STRING);
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Products', 'filename');
  },
};
