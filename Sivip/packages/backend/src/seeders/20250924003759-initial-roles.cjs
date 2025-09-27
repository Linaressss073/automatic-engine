'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Inserta los roles iniciales en la tabla 'roles'
    await queryInterface.bulkInsert('roles', [
      {
        nombre: 'administrador',
      },
      {
        nombre: 'usuario',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Esto se ejecuta si necesitas revertir el seeder
    await queryInterface.bulkDelete('roles', null, {});
  }
};