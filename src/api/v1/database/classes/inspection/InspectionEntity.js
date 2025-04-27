const { Inspection } = require("../../models");

class InspectionEntity {
  static async createInspection(data) {
    try {
      const newInspection = await Inspection.create(data);

      return newInspection;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateInspection(uid, data) {
    try {
      const updatedInspection = await Inspection.findByPk(uid);
      await updatedInspection.update(data);
      return updatedInspection;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async deleteInspection(uid) {
    try {
      const deletedInspection = await Inspection.findByPk(uid);
      await deletedInspection.destroy();
      return { success: true, message: "Inspection successfully deleted" };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getInspection(id) {
    try {
      const result = await Inspection.findOne({
        where: { id },
      });
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }
}

module.exports = InspectionEntity;
