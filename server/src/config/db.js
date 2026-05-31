import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

const dbName = process.env.DB_NAME || 'emergencycare360';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: true, // adds createdAt and updatedAt columns
    underscored: false, // Keep camelCase fields matching mongoose
  },
});

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
    
    // Synchronize models
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    process.exit(1);
  }
};
