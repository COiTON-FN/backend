const { Op } = require("sequelize");
const { ListingFilter } = require("../../models");

class ListingFilterEntity {
  static async createListingFilter(data) {
    try {
      const newListingFilter = await ListingFilter.create(data);

      return newListingFilter;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateListingFilter(uid, data) {
    try {
      const updatedListingFilter = await ListingFilter.findByPk(uid);
      await updatedListingFilter.update(data);
      return updatedListingFilter;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async deleteListingFilter(uid) {
    try {
      const deletedListingFilter = await ListingFilter.findByPk(uid);
      await deletedListingFilter.destroy();
      return { success: true, message: "Listing filter successfully deleted" };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getListingFilter(id) {
    try {
      const result = await ListingFilter.findOne({
        where: { id },
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getListingsByKeywords(queries) {
    try {
      const result = await ListingFilter.findAll({
        where: {
          keywords: {
            [Op.overlap]: queries.map((mp) => mp.toLowerCase()),
          },
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getAllListingFilters(page = 0, size = 100) {
    try {
      const listing_filters = await ListingFilter.findAndCountAll({
        distinct: true,
        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return listing_filters;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ListingFilterEntity;
