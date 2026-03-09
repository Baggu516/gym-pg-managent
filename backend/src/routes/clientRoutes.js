const express = require("express");

const {
  createClient,
  createGymClient,
  createPgClient,
  deleteClient,
  getClientById,
  getClients,
  getGymClients,
  getPgClients,
  updateClient,
} = require("../controllers/clientController");

const router = express.Router();

router.get("/", getClients);
router.get("/gyms", getGymClients);
router.get("/pgs", getPgClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.post("/gyms", createGymClient);
router.post("/pgs", createPgClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
