const { Sequelize } = require('sequelize');
const config = require('./dist/config/database');

const sequelize = new Sequelize(config);

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Add companyId column if not exists
    const tables = [
      "Users", "Tickets", "Messages", "Contacts", "Whatsapps", 
      "Queues", "Settings", "QuickAnswers", "Tags"
    ];

    try {
      await sequelize.query("CREATE TABLE IF NOT EXISTS `Plans` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255) NOT NULL UNIQUE, `users` INTEGER DEFAULT 0, `whatsapps` INTEGER DEFAULT 0, `queues` INTEGER DEFAULT 0, `value` DECIMAL(10, 2) DEFAULT 0, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;");
      await sequelize.query("CREATE TABLE IF NOT EXISTS `Companies` (`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL UNIQUE, `passwordHash` VARCHAR(255) NOT NULL, `planId` INTEGER, `plan` VARCHAR(255) DEFAULT 'free', `status` TINYINT(1) DEFAULT 1, `dueDate` DATETIME, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`), FOREIGN KEY (`planId`) REFERENCES `Plans` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE) ENGINE=InnoDB;");
    } catch (e) {
      console.log("Tables Plans/Companies might already exist or error:", e.message);
    }

    for (const table of tables) {
      try {
        await sequelize.query(`ALTER TABLE ${table} ADD COLUMN companyId INTEGER REFERENCES Companies(id) ON DELETE CASCADE ON UPDATE CASCADE;`);
        console.log(`Column companyId added to ${table}`);
      } catch (e) {
        console.log(`Column already exists in ${table} or error:`, e.message);
      }
    }

    // Default data
    await sequelize.query("INSERT IGNORE INTO Plans (name, users, whatsapps, queues, value, createdAt, updatedAt) VALUES ('Administrador', 10, 10, 10, 0, NOW(), NOW());");
    const [plans] = await sequelize.query("SELECT id FROM Plans LIMIT 1;");
    if (plans.length > 0) {
      const planId = plans[0].id;
      await sequelize.query(`INSERT IGNORE INTO Companies (name, email, passwordHash, planId, status, createdAt, updatedAt) VALUES ('Mi Empresa', 'admin@empresa.com', 'dummy', ${planId}, 1, NOW(), NOW());`);
      const [companies] = await sequelize.query("SELECT id FROM Companies LIMIT 1;");
      if (companies.length > 0) {
        const companyId = companies[0].id;
        for (const table of tables) {
          await sequelize.query(`UPDATE ${table} SET companyId = ${companyId} WHERE companyId IS NULL;`);
        }
        console.log("Data migrated to default company!");
      }
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

run();
