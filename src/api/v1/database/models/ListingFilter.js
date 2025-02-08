"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListingFilter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ListingFilter.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      keywords: {
        type: DataTypes.JSONB, // Use JSONB for efficient querying
        allowNull: false,
        defaultValue: [],
        set(value) {
          this.setDataValue(
            "keywords",
            Array.isArray(value) ? value.map((v) => v.toLowerCase()) : []
          );
        },
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "listing_filters",
      modelName: "ListingFilter",
    }
  );

  return ListingFilter;
};
