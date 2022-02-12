const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  roles: { type: Array, default: [] },
});

module.exports = model("roles", schema);