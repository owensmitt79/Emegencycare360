import sequelize from './src/config/database.js';
import User from './src/models/User.js';

(async () => {
  try {
    console.log('Connecting to the database...');
    await sequelize.authenticate();
    
    // Ensure tables exist before trying to create a user
    await sequelize.sync();
    
    const email = 'admin@test.com';
    const password = 'admin123';
    
    const existingAdmin = await User.findOne({ where: { email } });
    
    if (!existingAdmin) {
      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email,
        password,
        role: 'admin',
        verified: true,
      });
      console.log(`\nSUCCESS: Admin user created!\nEmail: ${email}\nPassword: ${password}\n`);
    } else {
      console.log(`\nAdmin user already exists with email ${email}.\nIf you cannot log in, the password might have been changed.\n`);
      
      // Optionally reset password for convenience
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log(`Password has been reset to: ${password}\n`);
    }
  } catch (err) {
    console.error('\nERROR seeding admin:', err.message);
  } finally {
    process.exit(0);
  }
})();
