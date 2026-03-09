const mongoose = require("mongoose");

const pocSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

function createClientSchema(type) {
  const clientSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      owner: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        enum: ["gym", "pg"],
        default: type,
        immutable: true,
      },
      plan: {
        type: String,
        required: true,
        trim: true,
      },
      status: {
        type: String,
        enum: ["active", "expiring", "trial"],
        default: "trial",
      },
      members: {
        type: Number,
        default: 0,
        min: 0,
      },
      revenue: {
        type: Number,
        default: 0,
        min: 0,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      pocs: {
        type: [pocSchema],
        default: [],
        validate: {
          validator(value) {
            return Array.isArray(value) && value.length > 0;
          },
          message: "At least one POC is required.",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  clientSchema.pre("validate", function setPrimaryOwner(next) {
    if (this.pocs.length > 0) {
      this.owner = this.pocs[0].name;
    }

    this.type = type;
    next();
  });

  return clientSchema;
}

module.exports = {
  createClientSchema,
};
