import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable("TicketTrackings", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            ticketId: {
                type: DataTypes.INTEGER,
                references: { model: "Tickets", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            whatsappId: {
                type: DataTypes.INTEGER,
                references: { model: "Whatsapps", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true
            },
            userId: {
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            finishedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            ratingAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        });
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable("TicketTrackings");
    }
};
