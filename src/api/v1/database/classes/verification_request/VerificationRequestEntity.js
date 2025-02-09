const { VerificationRequest } = require("../../models");

class VerificationEntity {
  static async createVerificationRequest(data) {
    try {
      const newVerification = await VerificationRequest.create(data);

      return newVerification;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateVerificationRequest(uid, data) {
    try {
      const updatedVerification = await VerificationRequest.findByPk(uid);
      await updatedVerification.update(data);
      return updatedVerification;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async deleteVerificationRequest(uid) {
    try {
      const deletedVerification = await VerificationRequest.findByPk(uid);
      await deletedVerification.destroy();
      return {
        success: true,
        message: "Verification request successfully deleted",
      };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getVerificationRequest(id) {
    try {
      const result = await VerificationRequest.findByPk(id);
      return result;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getAllVerificationRequests(query = {}, page = 0, size = 100) {
    try {
      const verifications = await VerificationRequest.findAndCountAll({
        distinct: true,
        where: query,

        limit: size,
        offset: page * size,
        order: [["createdAt", "DESC"]],
      });
      return verifications;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = VerificationEntity;
