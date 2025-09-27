'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING, allowNull: false, unique: true },
    });
    
    await queryInterface.createTable('users', { // <-- CORRECCIÓN AQUÍ
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      idRol: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' } },
      activo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    
    await queryInterface.createTable('password_reset_tokens', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }, // <-- CORRECCIÓN AQUÍ
      token: { type: Sequelize.STRING, allowNull: false, unique: true },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
    });
    
    await queryInterface.createTable('casilleros', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      numero: { type: Sequelize.STRING, allowNull: false, unique: true },
      ubicacion: { type: Sequelize.STRING, allowNull: false },
      tamaño: { type: Sequelize.ENUM('PEQUEÑO', 'MEDIANO', 'GRANDE'), allowNull: false },
      estado: { type: Sequelize.ENUM('DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO'), allowNull: false, defaultValue: 'DISPONIBLE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    
    await queryInterface.createTable('coches', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      placa: { type: Sequelize.STRING, allowNull: false, unique: true },
      marca: { type: Sequelize.STRING, allowNull: false },
      modelo: { type: Sequelize.STRING, allowNull: false },
      color: { type: Sequelize.STRING, allowNull: false },
      año: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    
    await queryInterface.createTable('paquetes', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      descripcion: { type: Sequelize.STRING, allowNull: false },
      peso: { type: Sequelize.FLOAT, allowNull: false },
      fechaEnvio: { type: Sequelize.DATE, allowNull: false },
      fechaEntrega: { type: Sequelize.DATE },
      remitente: { type: Sequelize.STRING, allowNull: false },
      destinatario: { type: Sequelize.STRING, allowNull: false },
      estado: { type: Sequelize.ENUM('RECOGIDO', 'NO_RECOGIDO', 'EN_ESPERA', 'EN_TRANSITO'), allowNull: false, defaultValue: 'EN_ESPERA' },
      codigoSeguimiento: { type: Sequelize.STRING, allowNull: false, unique: true },
      usuarioId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }, // <-- CORRECCIÓN AQUÍ
      casilleroId: { type: Sequelize.INTEGER, references: { model: 'casilleros', key: 'id' } },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
    
    await queryInterface.createTable('visitantes', {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      documento: { type: Sequelize.STRING, allowNull: false, unique: true },
      telefono: { type: Sequelize.STRING },
      fechaVisita: { type: Sequelize.DATE, allowNull: false },
      horaEntrada: { type: Sequelize.DATE },
      horaSalida: { type: Sequelize.DATE },
      usuarioId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }, // <-- CORRECCIÓN AQUÍ
      cocheId: { type: Sequelize.INTEGER, references: { model: 'coches', key: 'id' } },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('visitantes');
    await queryInterface.dropTable('paquetes');
    await queryInterface.dropTable('coches');
    await queryInterface.dropTable('casilleros');
    await queryInterface.dropTable('password_reset_tokens');
    await queryInterface.dropTable('users'); // <-- CORRECCIÓN AQUÍ
    await queryInterface.dropTable('roles');
  }
};