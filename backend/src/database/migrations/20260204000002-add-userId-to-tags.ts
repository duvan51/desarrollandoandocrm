import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tags", "userId", {
                type: DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true // Allow null for existing tags, but we should ideally assign them to a user
            }),
            // Remove unique constraint from name if it exists
            // In MySQL it's usually just 'name' or 'Tags_name_unique'
            // Since it was defined as unique: true in previous migration, let's try to remove it.
            queryInterface.removeConstraint("Tags", "name").catch(() => {
                console.log("Constraint 'name' not found, skipping...");
            }),
            queryInterface.addConstraint("Tags", ["name", "userId"], {
                type: "unique",
                name: "Tags_name_userId_unique"
            })
        ]);
    },

    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.removeConstraint("Tags", "Tags_name_userId_unique"),
            queryInterface.removeColumn("Tags", "userId"),
            queryInterface.addConstraint("Tags", ["name"], {
                type: "unique",
                name: "Tags_name_unique" // Re-adding name unique if possible
            })
        ]);
    }
};
