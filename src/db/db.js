import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

const dbName = process.env.DB_NAME || 'emergencycare360';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 100,
      min: 10,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  if (!global.sequelizeInstance) {
    global.sequelizeInstance = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
        underscored: false,
      },
      pool: {
        max: 100,
        min: 10,
        acquire: 30000,
        idle: 10000,
      },
    });
  }
  sequelize = global.sequelizeInstance;
}

export const connectDB = async () => {
  try {
    // Connect to MySQL server to ensure the database exists
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
    
    // Connect Sequelize
    await sequelize.authenticate();
    console.log('MySQL/Sequelize Connected successfully.');
    
    // Synchronize models (we import them to register associations)
    const { initModels } = await import('./models/index.js');
    await initModels();
    
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    throw error;
  }
};

export { sequelize };
