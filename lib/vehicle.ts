import ParkingSpot from './parkingSpot';
import { VehicleSize } from './vehicleSize';

export interface VehicleProps {
  spotsNeeded: number;
  size: VehicleSize;
}

export abstract class AbstractVehicle {
  protected spotsNeeded: number;
  protected size: VehicleSize;
  protected parkingSpots: ParkingSpot[] = [];

  constructor(props: VehicleProps) {
    this.spotsNeeded = props.spotsNeeded;
    this.size = props.size;
  }

  // จำนวนช่องที่รถต้องใช้
  public getSpotsNeeded(): number {
    return this.spotsNeeded;
  }

  // ขนาดของรถ
  public getSize(): VehicleSize {
    return this.size;
  }

  // บันทึกว่ารถจอดตรงไหน
  public parkInSpot(spot: ParkingSpot): void {
    this.parkingSpots.push(spot);
  }

  // เคลียร์เมื่อรถออก
  public clearSpots(): void {
    for (const spot of this.parkingSpots) {
      spot.removeVehicle();
    }
    this.parkingSpots = [];
  }

  // กำหนดใน subclass ว่าจอดตรงจุดนี้ได้หรือไม่
  public abstract canFitInSpot(spot: ParkingSpot): boolean;

  // ใช้แสดงตัวอักษรแทนรถ เช่น 'C', 'B', 'M'
  public abstract print(): string;
}