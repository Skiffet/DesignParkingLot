import { VehicleSize } from './vehicleSize';
import { AbstractVehicle } from './vehicle';
import Level from './level';
import Car from './car';
import Bus from './bus';
import Motorcycle from './motorcycle';

class ParkingSpot {
  private vehicle: AbstractVehicle | null = null;
  private spotSize: VehicleSize;
  private row: number;
  private spotNumber: number;
  private level: Level;

  constructor(level: Level, row: number, spotNumber: number, spotSize: VehicleSize, vehicleType: string | null = null) {
    this.level = level;
    this.row = row;
    this.spotNumber = spotNumber;
    this.spotSize = spotSize;
    
    this.settingVehicleType(vehicleType);
  }

  settingVehicleType(vehicleType: string | null): void {
    if (vehicleType) {
      switch (vehicleType) {
        case 'Car':
          this.vehicle = new Car();
          break;
        case 'Bus':
          this.vehicle = new Bus();
          break;
        case 'Motorcycle':
          this.vehicle = new Motorcycle();
          break;
      }
    }
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

  getVehicleType(): string | null {
    if (this.vehicle instanceof Car) return "Car";
    if (this.vehicle instanceof Bus) return "Bus";
    if (this.vehicle instanceof Motorcycle) return "Motorcycle";
    return null;
  }

  removeVehicle(): void {
    this.level.spotFreed();
    this.vehicle = null;
  }

  print(): string {
    if (this.vehicle !== null) {
      return this.vehicle.print();
    }
  
    switch (this.spotSize) {
      case VehicleSize.Compact:
        return 'c';
      case VehicleSize.Large:
        return 'l';
      case VehicleSize.Motorcycle:
        return 'm';
      default:
        return '?';
    }
  }
}

export default ParkingSpot;