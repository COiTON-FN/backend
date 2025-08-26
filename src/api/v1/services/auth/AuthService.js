const { CheckDBResponse } = require("../../helpers");
const { Token } = require("../../database/classes");
const jwt = require("jsonwebtoken");
const mailService = require("../../helpers/email/EmailConfig");
const crypto = require("crypto");

exports.signUp = async (data) => {
  try {
    const randomBytes = crypto.randomBytes(32); // 32 bytes = 256 bits
    const access = "auth";
    const accessToken = jwt.sign(
      {
        access,
        email: data.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 600 }
    );
    // Hash the random value using SHA-256
    const hash = crypto
      .createHash("sha256")
      .update(randomBytes)
      .digest("hex")
      .substring(0, 4)
      .toLowerCase();
    await Token.createVerificationToken({
      otp: hash,
      email: data.email,
      jwt: accessToken,
    });
    const emailHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .otp {
        background-color: #f1f1f1;
        padding: 10px 20px;
        font-size: 24px;
        letter-spacing: 4px;
        border-radius: 5px;
        display: inline-block;
        margin: 20px 0;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      h1 {
        color: #4CAF50;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin: 20px 0;
      }
      .btn {
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        text-decoration: none;
        border-radius: 5px;
        font-size: 18px;
        display: inline-block;
      }
      .btn:hover {
        background-color: #45a049;
      }
      footer {
        margin-top: 20px;
        font-size: 12px;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Verification</h1>
      <p>Hi there,</p>
      <p>Thanks for signing up! Please verify your email address by entering the OTP below:</p>
     <h1 class="otp">${hash}</h1>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <footer>
        <p>&copy; ${new Date().getFullYear()} Coiton. All rights reserved.</p>
      </footer>
    </div>
  </body>
  </html>
  `;
    await mailService.sendMail(data.email, ``, emailHTML);

    return CheckDBResponse.successResponse({
      message: "OK",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};

exports.verify = async (data) => {
  try {
    const token = await Token.getTokenDetails({
      jwt: data.jwt.trim(),
      otp: data.otp.toLowerCase().trim(),
    });

    if (!token) {
      return CheckDBResponse.errorResponse("Invalid Token");
    }
    if (token.verified) {
      return CheckDBResponse.errorResponse("Email already verified");
    }

    const _ = jwt.verify(token.jwt, process.env.ACCESS_TOKEN_SECRET);
    await token.update({
      verified: true,
    });

    return CheckDBResponse.successResponse({
      ...token.dataValues,
      otp: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.sendVerification = async (email) => {
  try {
    const token = await Token.getTokenDetails({ email });
    if (!token) {
      return await this.signUp({ email });
    }
    if (token.verified) {
      return CheckDBResponse.errorResponse("Email already verified");
    }
    let newJWT = undefined;
    jwt.verify(token.jwt, process.env.ACCESS_TOKEN_SECRET, (err, _) => {
      if (err) {
        const access = "auth";
        const accessToken = jwt.sign(
          {
            access,
            email: email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 600 }
        );
        newJWT = accessToken;
      }
    });
    const randomBytes = crypto.randomBytes(32); // 32 bytes = 256 bits

    // Hash the random value using SHA-256
    const hash = crypto
      .createHash("sha256")
      .update(randomBytes)
      .digest("hex")
      .substring(0, 4)
      .toLowerCase();
    await token.update({ otp: hash, jwt: newJWT });
    const emailHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .otp {
        background-color: #f1f1f1;
        padding: 10px 20px;
        font-size: 24px;
        letter-spacing: 4px;
        border-radius: 5px;
        display: inline-block;
        margin: 20px 0;
      }
      .container {
        max-width: 600px;
        margin: 50px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      h1 {
        color: #4CAF50;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        margin: 20px 0;
      }
      .btn {
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        text-decoration: none;
        border-radius: 5px;
        font-size: 18px;
        display: inline-block;
      }
      .btn:hover {
        background-color: #45a049;
      }
      footer {
        margin-top: 20px;
        font-size: 12px;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Verification</h1>
      <p>Hi there,</p>
      <p>We received a request to reset your password. Please enter the OTP below to proceed with resetting your password:</p>
     <h1 class="otp">${hash}</h1>
      <p>If you did not request a password reset, please ignore this email.</p>
      <footer>
        <p>&copy; ${new Date().getFullYear()} Coiton. All rights reserved.</p>
      </footer>
    </div>
  </body>
  </html>
  `;
    await mailService.sendMail(email, ``, emailHTML);

    return CheckDBResponse.successResponse({
      ...token,
      otp: undefined,
    });
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};
