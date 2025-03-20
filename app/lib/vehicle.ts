import { VehicleSize } from "./vehicleSize"; // ✅ ใช้ import ที่ถูกต้อง

export abstract class Vehicle {
    parkingSpots: any[] = [];
    licensePlate: string;
    spotsNeeded: number;
    size: VehicleSize;

    constructor(licensePlate: string, spotsNeeded: number, size: VehicleSize) {
        this.licensePlate = licensePlate;
        this.spotsNeeded = spotsNeeded;
        this.size = size;
    }

    getSpotsNeeded(): number {
        return this.spotsNeeded;
    }

    getSize(): VehicleSize {
        return this.size;
    }

    parkInSpot(spot: any): void {
        this.parkingSpots.push(spot);
    }

    clearSpots(): void {
        this.parkingSpots.forEach((spot) => spot.removeVehicle());
        this.parkingSpots = [];
    }

    abstract canFitInSpot(spot: any): boolean;
    abstract print(): void;
}