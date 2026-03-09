const mongoose = require("mongoose");

const { createClientSchema } = require("./Client");

module.exports =
  mongoose.models.GymClient ||
  mongoose.model("GymClient", createClientSchema("gym"), "gym_clients");
