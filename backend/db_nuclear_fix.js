const { Sequelize } = require('sequelize');
const config = require('./dist/config/database');

const sequelize = new Sequelize(config);

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Drop and Recreate Companies to ensure correct schema
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await sequelize.query("DROP TABLE IF EXISTS Companies;");
    await sequelize.query("DROP TABLE IF EXISTS Plans;");
    
    // 1. Create Plans table
    await sequelize.query(`
      CREATE TABLE Plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        users INT DEFAULT 0,
        whatsapps INT DEFAULT 0,
        queues INT DEFAULT 0,
        value DECIMAL(10, 2) DEFAULT 0,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      ) ENGINE=InnoDB;
    `);

    // 2. Create Companies table
    await sequelize.query(`
      CREATE TABLE Companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        planId INT,
        status TINYINT(1) DEFAULT 1,
        dueDate DATETIME,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (planId) REFERENCES Plans(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

    // 3. Add companyId to tables
    const tables = [
      "Users", "Tickets", "Messages", "Contacts", "Whatsapps", 
      "Queues", "Settings", "QuickAnswers", "Tags"
    ];

    for (const table of tables) {
      try {
        await sequelize.query(`ALTER TABLE ${table} ADD COLUMN companyId INT;`);
        console.log(`Column companyId added to ${table}`);
      } catch (e) {
        console.log(`Column already exists in ${table}`);
      }
      
      try {
        await sequelize.query(`ALTER TABLE ${table} ADD CONSTRAINT FK_${table}_Company FOREIGN KEY (companyId) REFERENCES Companies(id) ON DELETE CASCADE;`);
        console.log(`Foreign Key added to ${table}`);
      } catch (e) {
        console.log(`FK already exists in ${table}`);
      }
    }

    // 4. Seed initial data
    await sequelize.query("INSERT INTO Plans (name, users, whatsapps, queues, value, createdAt, updatedAt) VALUES ('Administrador', 10, 10, 10, 0.00, NOW(), NOW());");
    
    const [plans] = await sequelize.query("SELECT id FROM Plans WHERE name = 'Administrador' LIMIT 1;");
    const planId = plans[0].id;
    
    await sequelize.query(`INSERT INTO Companies (name, email, passwordHash, planId, status, createdAt, updatedAt) VALUES ('Mi Empresa', 'admin@empresa.com', 'dummy', ${planId}, 1, NOW(), NOW());`);
    
    const [companies] = await sequelize.query("SELECT id FROM Companies LIMIT 1;");
    const companyId = companies[0].id;
    
    for (const table of tables) {
      await sequelize.query(`UPDATE ${table} SET companyId = ${companyId} WHERE companyId IS NULL;`);
    }
    
    console.log("Database Fix Completed Successfully!");

  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    await sequelize.close();
  }
}

run();
