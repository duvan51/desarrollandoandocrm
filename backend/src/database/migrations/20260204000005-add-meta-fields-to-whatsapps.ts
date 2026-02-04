import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Whatsapps", "channel", {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "whatsapp"
            }),
            queryInterface.addColumn("Whatsapps", "token", {
                type: DataTypes.TEXT,
                allowNull: true
            }),
            queryInterface.addColumn("Whatsapps", "verifyToken", {
                type: DataTypes.STRING,
                allowNull: true
            })
        ]);
    },

    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Whatsapps", "channel"),
            queryInterface.removeColumn("Whatsapps", "token"),
            queryInterface.removeColumn("Whatsapps", "verifyToken")
        ]);
    }
};
