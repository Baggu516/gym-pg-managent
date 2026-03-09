const mongoose = require("mongoose");

const { createClientSchema } = require("./Client");

module.exports =
  mongoose.models.PgClient ||
  mongoose.model("PgClient", createClientSchema("pg"), "pg_clients");
