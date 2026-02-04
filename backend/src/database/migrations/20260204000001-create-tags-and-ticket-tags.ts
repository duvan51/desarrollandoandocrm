import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.createTable("Tags", {
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
                color: {
                    type: DataTypes.STRING,
                    defaultValue: "#7C7C7C"
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                }
            }),
            queryInterface.createTable("TicketTags", {
                ticketId: {
                    type: DataTypes.INTEGER,
                    references: { model: "Tickets", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                    allowNull: false
                },
                tagId: {
                    type: DataTypes.INTEGER,
                    references: { model: "Tags", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                    allowNull: false
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                }
            })
        ]);
    },

    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.dropTable("TicketTags"),
            queryInterface.dropTable("Tags")
        ]);
    }
};
