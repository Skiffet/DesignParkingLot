import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
    spots: {
      type: [
        {
          row: Number,
          spotNumber: Number,
          size: String,
          isAvailable: Boolean,
          vehicleType: {
            type: String,
            enum: ["Car", "Bus", "Motorcycle", null],
            default: null,
          },
        },
      ],
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
  });

const Levels = mongoose.model("Level", levelSchema);

export default Levels;