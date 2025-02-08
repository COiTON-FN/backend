const MessageResponse = require("./messages/MessageResponse");
const { DatabaseResponse, UsersResponse } = require("./messages/DatabaseResponse");
const CheckDBResponse = require("./messages/CheckDBStatus");
// const GenerateToken = require("./token/Tokens");
module.exports = {
    MessageResponse,
    DatabaseResponse,
    UsersResponse,
    CheckDBResponse,
    // GenerateToken,
}