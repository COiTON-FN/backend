const { Token } = require("../../models");

class TokenEntity {
  static async createToken(data) {
    try {
      const newToken = await Token.create(data);
      return newToken;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async createVerificationToken(data) {
    try {
      const newToken = await Token.create(data);
      return newToken;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async updateToken(uid, data) {
    try {
      const updatedToken = await Token.findByPk(uid);
      await updatedToken.update(data);
      return updatedToken;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async deleteToken(email) {
    try {
      const deletedToken = await Token.findOne({ where: { email } });
      await deletedToken.destroy();
      return { success: true, message: "Token successfully deleted" };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async deleteVerificationTokens(email) {
    try {
      await Token.destroy({ where: { email } });
      return { success: true, message: "Token successfully deleted" };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getTokenById(email) {
    try {
      const userToken = await Token.findOne({ where: { email } });
      return userToken;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getVerificationTokenByOTP(otp) {
    try {
      const token = await Token.findOne({ where: { otp } });
      return token;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getTokenDetails(params) {
    try {
      const token = await Token.findOne({ where: params });
      return token;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }

  static async getUserByToken(jwt) {
    try {
      const userToken = await Token.findOne({ where: { jwt } });
      return userToken;
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }
}

module.exports = TokenEntity;
