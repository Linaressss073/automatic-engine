import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_EXTERNAL_URL!, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// --- ENUMS ---
export enum EstadoRecogida {
  RECOGIDO = 'RECOGIDO',
  NO_RECOGIDO = 'NO_RECOGIDO',
  EN_ESPERA = 'EN_ESPERA',
  EN_TRANSITO = 'EN_TRANSITO'
}

export enum EstadoCasillero {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADO = 'OCUPADO',
  MANTENIMIENTO = 'MANTENIMIENTO'
}

// --- INTERFACES DE ATRIBUTOS ---
interface RolAttributes {
  id: number;
  nombre: string;
}

interface UserAttributes {
  id: number;
  nombre: string;
  email: string;
  password: string;
  idRol: number;
  activo?: boolean;
}

interface PasswordResetTokenAttributes {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
}

interface CasilleroAttributes {
  id: number;
  numero: string;
  ubicacion: string;
  tamaño: 'PEQUEÑO' | 'MEDIANO' | 'GRANDE';
  estado: EstadoCasillero;
}

interface PaqueteAttributes {
  id: number;
  descripcion: string;
  peso: number;
  fechaEnvio: Date;
  fechaEntrega?: Date;
  remitente: string;
  destinatario: string;
  estado: EstadoRecogida;
  usuarioId: number;
  casilleroId?: number;
  codigoSeguimiento: string;
}

interface VisitanteAttributes {
  id: number;
  nombre: string;
  documento: string;
  telefono?: string;

  fechaVisita: Date;
  horaEntrada?: Date;
  horaSalida?: Date;
  usuarioId: number;
  cocheId?: number;
}

interface CocheAttributes {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  año: number;
}

// --- DEFINICIÓN DE MODELOS ---

class Rol extends Model<RolAttributes, Optional<RolAttributes, 'id'>> implements RolAttributes {
  public id!: number;
  public nombre!: string;
}
Rol.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { sequelize, modelName: 'Rol', tableName: 'roles', timestamps: false });


class User extends Model<UserAttributes, Optional<UserAttributes, 'id'>> {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public idRol!: number;
  public activo!: boolean;
  public Rol?: Rol;
}
User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  idRol: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'roles', key: 'id' } },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { sequelize, modelName: 'User', tableName: 'users', timestamps: true }); // <-- CORRECCIÓN AQUÍ


class PasswordResetToken extends Model<PasswordResetTokenAttributes, Optional<PasswordResetTokenAttributes, 'id'>> {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
}
PasswordResetToken.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }, // <-- CORRECCIÓN AQUÍ
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
}, { sequelize, modelName: 'PasswordResetToken', tableName: 'password_reset_tokens', timestamps: false });


class Casillero extends Model<CasilleroAttributes, Optional<CasilleroAttributes, 'id'>> implements CasilleroAttributes {
  public id!: number;
  public numero!: string;
  public ubicacion!: string;
  public tamaño!: 'PEQUEÑO' | 'MEDIANO' | 'GRANDE';
  public estado!: EstadoCasillero;
}
Casillero.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  numero: { type: DataTypes.STRING, allowNull: false, unique: true },
  ubicacion: { type: DataTypes.STRING, allowNull: false },
  tamaño: { type: DataTypes.ENUM('PEQUEÑO', 'MEDIANO', 'GRANDE'), allowNull: false },
  estado: { type: DataTypes.ENUM(...Object.values(EstadoCasillero)), allowNull: false, defaultValue: EstadoCasillero.DISPONIBLE },
}, { sequelize, modelName: 'Casillero', tableName: 'casilleros' });


class Coche extends Model<CocheAttributes, Optional<CocheAttributes, 'id'>> implements CocheAttributes {
  public id!: number;
  public placa!: string;
  public marca!: string;
  public modelo!: string;
  public color!: string;
  public año!: number;
}
Coche.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  placa: { type: DataTypes.STRING, allowNull: false, unique: true },
  marca: { type: DataTypes.STRING, allowNull: false },
  modelo: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  año: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'Coche', tableName: 'coches' });


class Paquete extends Model<PaqueteAttributes, Optional<PaqueteAttributes, 'id'>> implements PaqueteAttributes {
  public id!: number;
  public descripcion!: string;
  public peso!: number;
  public fechaEnvio!: Date;
  public fechaEntrega?: Date;
  public remitente!: string;
  public destinatario!: string;
  public estado!: EstadoRecogida;
  public usuarioId!: number;
  public casilleroId?: number;
  public codigoSeguimiento!: string;
}
Paquete.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  descripcion: { type: DataTypes.STRING, allowNull: false },
  peso: { type: DataTypes.FLOAT, allowNull: false },
  fechaEnvio: { type: DataTypes.DATE, allowNull: false },
  fechaEntrega: { type: DataTypes.DATE },
  remitente: { type: DataTypes.STRING, allowNull: false },
  destinatario: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.ENUM(...Object.values(EstadoRecogida)), allowNull: false, defaultValue: EstadoRecogida.EN_ESPERA },
  codigoSeguimiento: { type: DataTypes.STRING, allowNull: false, unique: true },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }, // <-- CORRECCIÓN AQUÍ
  casilleroId: { type: DataTypes.INTEGER, references: { model: 'casilleros', key: 'id' } },
}, { sequelize, modelName: 'Paquete', tableName: 'paquetes' });


class Visitante extends Model<VisitanteAttributes, Optional<VisitanteAttributes, 'id'>> implements VisitanteAttributes {
  public id!: number;
  public nombre!: string;
  public documento!: string;
  public telefono?: string;
  public fechaVisita!: Date;
  public horaEntrada?: Date;
  public horaSalida?: Date;
  public usuarioId!: number;
  public cocheId?: number;
}
Visitante.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  documento: { type: DataTypes.STRING, allowNull: false, unique: true },
  telefono: { type: DataTypes.STRING },
  fechaVisita: { type: DataTypes.DATE, allowNull: false },
  horaEntrada: { type: DataTypes.DATE },
  horaSalida: { type: DataTypes.DATE },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }, // <-- CORRECCIÓN AQUÍ
  cocheId: { type: DataTypes.INTEGER, references: { model: 'coches', key: 'id' } },
}, { sequelize, modelName: 'Visitante', tableName: 'visitantes' });

// --- ASOCIACIONES / RELACIONES ---
Rol.hasMany(User, { foreignKey: 'idRol' });
User.belongsTo(Rol, { foreignKey: 'idRol' });

User.hasMany(PasswordResetToken, { foreignKey: 'userId' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Paquete, { foreignKey: 'usuarioId', as: 'paquetes' });
Paquete.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

Casillero.hasMany(Paquete, { foreignKey: 'casilleroId', as: 'paquetes' });
Paquete.belongsTo(Casillero, { foreignKey: 'casilleroId', as: 'casillero' });

User.hasMany(Visitante, { foreignKey: 'usuarioId', as: 'visitantes' });
Visitante.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

Coche.hasMany(Visitante, { foreignKey: 'cocheId', as: 'visitantes' });
Visitante.belongsTo(Coche, { foreignKey: 'cocheId', as: 'coche' });

// --- EXPORTACIÓN ---
export {
  sequelize,
  User,
  Rol,
  PasswordResetToken,
  Casillero,
  Paquete,
  Visitante,
  Coche
};