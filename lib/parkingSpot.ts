import { VehicleSize } from './vehicleSize';
import { AbstractVehicle } from './vehicle';
import Level from './level';

class ParkingSpot {
  private vehicle: AbstractVehicle | null = null;
  private spotSize: VehicleSize;
  private row: number;
  private spotNumber: number;
  private level: Level;

  constructor(level: Level, row: number, spotNumber: number, spotSize: VehicleSize) {
    this.level = level;
    this.row = row;
    this.spotNumber = spotNumber;
    this.spotSize = spotSize;
  }

  isAvailable(): boolean {
    return this.vehicle === null;
  }

  canFitVehicle(vehicle: AbstractVehicle): boolean {
    return this.isAvailable() && vehicle.canFitInSpot(this);
  }

  park(v: AbstractVehicle): boolean {
    if (!this.canFitVehicle(v)) return false;
    this.vehicle = v;
    v.parkInSpot(this);
    return true;
  }

  getRow(): number {
    return this.row;
  }

  getSpotNumber(): number {
    return this.spotNumber;
  }

  getSize(): VehicleSize {
    return this.spotSize;
  }

  removeVehicle(): void {
    this.level.spotFreed();
    this.vehicle = null;
  }

  print(): string {
    if (this.vehicle === null) {
      switch (this.spotSize) {
        case VehicleSize.Compact: return 'c';
        case VehicleSize.Large: return 'l';
        case VehicleSize.Motorcycle: return 'm';
      }
    }
    return this.vehicle!.print();
  }
}

export default ParkingSpot;