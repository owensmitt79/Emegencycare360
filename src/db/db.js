import { Sequelize } from 'sequelize';
import pg from 'pg';

const dbName = process.env.DB_NAME || 'emergencycare360';
const dbUser = process.env.DB_USER || 'postgres';
const dbPass = process.env.DB_PASS || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 100,
      min: 10,
      acquire: 2000,
      idle: 10000,
    },
  });
} else {
  if (!global.sequelizeInstance) {
    global.sequelizeInstance = new Sequelize(dbName, dbUser, dbPass, {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
      logging: false,
      define: {
        timestamps: true,
        underscored: false,
      },
      pool: {
        max: 100,
        min: 10,
        acquire: 2000,
        idle: 10000,
      },
    });
  }
  sequelize = global.sequelizeInstance;
}

export const connectDB = async () => {
  try {
    // Connect to PostgreSQL server (default postgres database) to ensure our app DB exists
    const client = new pg.Client({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
      database: 'postgres',
    });
    await client.connect();
    
    // Check if the database exists
    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    }
    await client.end();
    
    // Connect Sequelize
    await sequelize.authenticate();
    console.log('PostgreSQL/Sequelize Connected successfully.');
    
    // Synchronize models (we import them to register associations)
    const { initModels } = await import('./models/index.js');
    await initModels();
    
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error);
    throw error;
  }
};

// Automatically connect and sync tables on import
connectDB().catch(err => {
  console.error('Auto DB connection/sync failed:', err);
});

export { sequelize };

