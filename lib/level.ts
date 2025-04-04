import ParkingSpot from './parkingSpot';
import { VehicleSize } from './vehicleSize';
import { AbstractVehicle } from './vehicle';

class Level {
  [x: string]: any;
  private spots: ParkingSpot[] = [];
  private floor: number;

  constructor(floor: number, numSpots: number) {
    this.floor = floor;

    for (let i = 0; i < numSpots; i++) {
      const size = i < numSpots / 3
        ? VehicleSize.Motorcycle
        : i < (2 * numSpots) / 3
        ? VehicleSize.Compact
        : VehicleSize.Large;

      const row = Math.floor(i / 10); // 10 spots per row
      this.spots.push(new ParkingSpot(this, row, i, size));
    }
  }

  static fromData(data: any): Level {
    const level = new Level(data.floor, 0);
  
    level.spots = data.spots.map((s: any) => {
      const size = s.size || s.spotSize;
      const row = s.row;
      const spotNumber = s.spotNumber;
  
      return new ParkingSpot(level, row, spotNumber, size as VehicleSize);
    });
  
    return level;
  }

  // ✅ ใช้สำหรับอนาคต เช่น แสดงเลขชั้น
  public getFloor(): number {
    return this.floor;
  }

  public getSpots(): ParkingSpot[] {
    return this.spots;
  }

  // ✅ จอดรถ (เช่น Bus ต้องใช้หลายจุดติดกัน)
  public parkVehicle(vehicle: AbstractVehicle): boolean {
    const spotsNeeded = vehicle.getSpotsNeeded();

    for (let i = 0; i <= this.spots.length - spotsNeeded; i++) {
      const slice = this.spots.slice(i, i + spotsNeeded);

      // ตรวจว่าทุกช่องว่างและเหมาะกับรถ
      const canParkAll = slice.every(spot => spot.canFitVehicle(vehicle));

      // ต้องอยู่ในแถวเดียวกัน (ป้องกัน Bus ข้ามแถว)
      const sameRow = slice.every((spot) => spot.getRow() === slice[0].getRow());

      if (canParkAll && sameRow) {
        for (let spot of slice) {
          spot.park(vehicle);
        }
        return true;
      }
    }

    return false; // ❌ ไม่มีจุดจอดที่เหมาะสม
  }

  // ✅ ใช้สำหรับตรวจว่ารถสามารถจอดที่ชั้นนี้ได้หรือไม่
  public canParkVehicle(vehicle: AbstractVehicle): boolean {
    const spotsNeeded = vehicle.getSpotsNeeded();

    for (let i = 0; i <= this.spots.length - spotsNeeded; i++) {
      const slice = this.spots.slice(i, i + spotsNeeded);
      const sameRow = slice.every((spot) => spot.getRow() === slice[0].getRow());

      if (sameRow && slice.every((spot) => spot.canFitVehicle(vehicle))) {
        return true;
      }
    }

    return false;
  }

  // ✅ สำหรับอนาคต: เมื่อรถออก
  public spotFreed(): void {
    // ยังไม่ต้องทำอะไรตอนนี้
  }

  // ✅ ใช้ใน UI เพื่อแสดงตัวอักษรของแต่ละจุด
  public print(): string[] {
    return this.spots.map((spot) => spot.print());
  }
}

export default Level;