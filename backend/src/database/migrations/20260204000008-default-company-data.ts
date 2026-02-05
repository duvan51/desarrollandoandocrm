import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        // 1. Create a default plan
        await queryInterface.bulkInsert("Plans", [{
            name: "Administrador",
            users: 10,
            whatsapps: 10,
            queues: 10,
            value: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);

        const [plans] = await queryInterface.sequelize.query("SELECT id FROM Plans LIMIT 1;");
        const planId = (plans[0] as any).id;

        // 2. Create a default company
        await queryInterface.bulkInsert("Companies", [{
            name: "Mi Empresa",
            email: "admin@empresa.com",
            passwordHash: "$2a$08$9S5Y7K7H7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.7.", // Dummy
            planId: planId,
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);

        const [companies] = await queryInterface.sequelize.query("SELECT id FROM Companies LIMIT 1;");
        const companyId = (companies[0] as any).id;

        // 3. Update all existing data with the default companyId
        const tables = [
            "Users",
            "Tickets",
            "Messages",
            "Contacts",
            "Whatsapps",
            "Queues",
            "Settings",
            "QuickAnswers",
            "Tags"
        ];

        for (const table of tables) {
            await queryInterface.sequelize.query(`UPDATE ${table} SET companyId = ${companyId} WHERE companyId IS NULL;`);
        }
    },

    down: async (queryInterface: QueryInterface) => {
        // Basic rollback
    }
};
