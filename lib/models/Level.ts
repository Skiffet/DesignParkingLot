import mongoose from "mongoose";

// Level {
//     spots: [
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot],
//       [ParkingSpot], [ParkingSpot], [ParkingSpot]
//     ],
//     floor: 0
//   },

const levelSchema = new mongoose.Schema({
    spots: {
        type: [[Object]],
        required: true,
    },
    floor: {
        type: Number,
        required: true,
    },
});

const Levels = mongoose.model("Level", levelSchema);

export default Levels;