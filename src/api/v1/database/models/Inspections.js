"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Inspection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Inspection.init(
    {
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
    },
    {
      sequelize,
      tableName: "inspections",
      modelName: "Inspection",
    }
  );

  return Inspection;
};
