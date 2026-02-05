const { Sequelize } = require('sequelize');
const config = require('./dist/config/database');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize(config);

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Create a Super Company (ID 1 is usually the first created)
    const [companies] = await sequelize.query("SELECT id FROM Companies WHERE id = 1 LIMIT 1;");
    if (companies.length === 0) {
      console.log("Company ID 1 not found. Please run the previous db fixes first.");
      return;
    }
    const companyId = companies[0].id;

    // 2. Prepare the Super Admin user
    const email = 'admin@admin.com';
    const password = 'admin'; // You should change this later!
    const passwordHash = await bcrypt.hash(password, 8);

    // 3. Create or Update the Super Admin
    // Profile "admin" is used in Whaticket for full access. 
    // In our SaaS logic, we can verify this user belongs to Company 1.
    await sequelize.query(`
      INSERT INTO Users (name, email, passwordHash, profile, companyId, createdAt, updatedAt) 
      VALUES ('Super Admin', '${email}', '${passwordHash}', 'admin', ${companyId}, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
      passwordHash = '${passwordHash}', 
      profile = 'admin',
      companyId = ${companyId},
      updatedAt = NOW();
    `);

    console.log('--------------------------------------------------');
    console.log('✅ Super Admin created/updated successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('--------------------------------------------------');
    console.log('Use these credentials to log in at http://localhost:3000');

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await sequelize.close();
  }
}

run();
