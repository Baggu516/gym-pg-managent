const GymClient = require("../models/GymClient");
const PgClient = require("../models/PgClient");

const modelByType = {
  gym: GymClient,
  pg: PgClient,
};

function getModelByType(type) {
  return modelByType[type];
}

async function findClientAcrossCollections(id) {
  const [gymClient, pgClient] = await Promise.all([
    GymClient.findById(id),
    PgClient.findById(id),
  ]);

  if (gymClient) {
    return { client: gymClient, model: GymClient, type: "gym" };
  }

  if (pgClient) {
    return { client: pgClient, model: PgClient, type: "pg" };
  }

  return null;
}

async function getClients(req, res, next) {
  try {
    const requestedType = req.query.type;

    if (requestedType === "gym" || requestedType === "pg") {
      const Model = getModelByType(requestedType);
      const clients = await Model.find().sort({ createdAt: -1 });
      return res.json(clients);
    }

    const [gyms, pgs] = await Promise.all([GymClient.find(), PgClient.find()]);

    const clients = [...gyms, ...pgs].sort(
      (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
    );

    res.json(clients);
  } catch (error) {
    next(error);
  }
}

async function getClientById(req, res, next) {
  try {
    const result = await findClientAcrossCollections(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(result.client);
  } catch (error) {
    next(error);
  }
}

async function createClient(req, res, next) {
  try {
    const Model = getModelByType(req.body.type);

    if (!Model) {
      return res
        .status(400)
        .json({ message: "Client type must be either gym or pg" });
    }

    const client = await Model.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
}

async function updateClient(req, res, next) {
  try {
    const result = await findClientAcrossCollections(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Client not found" });
    }

    const nextType = req.body.type || result.type;
    const TargetModel = getModelByType(nextType);

    if (!TargetModel) {
      return res
        .status(400)
        .json({ message: "Client type must be either gym or pg" });
    }

    if (nextType === result.type) {
      Object.assign(result.client, req.body);
      await result.client.save();
      return res.json(result.client);
    }

    const migratedPayload = {
      ...result.client.toObject(),
      ...req.body,
      _id: undefined,
      id: undefined,
      type: nextType,
      createdAt: undefined,
      updatedAt: undefined,
      __v: undefined,
    };

    const migratedClient = await TargetModel.create(migratedPayload);
    await result.client.deleteOne();

    res.json(migratedClient);
  } catch (error) {
    next(error);
  }
}

async function deleteClient(req, res, next) {
  try {
    const result = await findClientAcrossCollections(req.params.id);

    if (!result) {
      return res.status(404).json({ message: "Client not found" });
    }

    await result.client.deleteOne();
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
}

function createTypeController(type) {
  const Model = getModelByType(type);

  return {
    async list(_req, res, next) {
      try {
        const clients = await Model.find().sort({ createdAt: -1 });
        res.json(clients);
      } catch (error) {
        next(error);
      }
    },
    async create(req, res, next) {
      try {
        const client = await Model.create({
          ...req.body,
          type,
        });
        res.status(201).json(client);
      } catch (error) {
        next(error);
      }
    },
  };
}

const gymController = createTypeController("gym");
const pgController = createTypeController("pg");

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getGymClients: gymController.list,
  createGymClient: gymController.create,
  getPgClients: pgController.list,
  createPgClient: pgController.create,
};
