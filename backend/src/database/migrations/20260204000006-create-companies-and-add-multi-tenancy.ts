import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable("Companies", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            plan: {
                type: DataTypes.STRING,
                defaultValue: "free"
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            dueDate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });

        // Add companyId to relevant tables
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
            await queryInterface.addColumn(table, "companyId", {
                type: DataTypes.INTEGER,
                references: { model: "Companies", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true // Initially true to allow migration of existing data
            });
        }
    },

    down: async (queryInterface: QueryInterface) => {
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
            await queryInterface.removeColumn(table, "companyId");
        }

        await queryInterface.dropTable("Companies");
    }
};
