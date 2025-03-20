import { Vehicle } from "./vehicle";
import { VehicleSize } from "./vehicleSize";
import { ParkingSpot } from "./parkingSpot"; // ต้องสร้างไฟล์นี้ด้วย

export class Bus extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate, 5, VehicleSize.Large); // spotsNeeded = 5
    }

    canFitInSpot(spot: ParkingSpot): boolean {
        return spot.getSize() === VehicleSize.Large;
    }

    print(): void {
        console.log(`Bus with license plate ${this.licensePlate}`);
    }
}