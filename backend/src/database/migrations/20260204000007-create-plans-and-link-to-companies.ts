import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable("Plans", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            users: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            whatsapps: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            queues: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            value: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0
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

        // Add planId to Companies
        await queryInterface.addColumn("Companies", "planId", {
            type: DataTypes.INTEGER,
            references: { model: "Plans", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
            allowNull: true
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Companies", "planId");
        await queryInterface.dropTable("Plans");
    }
};
