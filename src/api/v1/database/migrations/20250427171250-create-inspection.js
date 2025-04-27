"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("inspections", {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          // Custom getter for parsing JSON when retrieved from the database
          const jsonString = this.getDataValue("data");
          return jsonString ? JSON.parse(jsonString) : null;
        },
        set(value) {
          // Custom setter for stringifying JSON when stored in the database
          this.setDataValue("data", value ? JSON.stringify(value) : null);
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("inspections");

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
