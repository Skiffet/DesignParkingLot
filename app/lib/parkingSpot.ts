import { VehicleSize } from "./vehicleSize";

export class ParkingSpot {
    private size: VehicleSize;

    constructor(size: VehicleSize) {
        this.size = size;
    }

    getSize(): VehicleSize {
        return this.size;
    }

    removeVehicle(): void {
        console.log("Vehicle removed from the spot");
    }
}