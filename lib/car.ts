import { AbstractVehicle, VehicleProps } from './vehicle';
import ParkingSpot from './parkingSpot';
import { VehicleSize } from './vehicleSize';

class Car extends AbstractVehicle {
  constructor(props: Partial<VehicleProps> = {}) {
    super({
      spotsNeeded: 1,
      size: VehicleSize.Compact,
      ...props
    });
  }

  canFitInSpot(spot: ParkingSpot): boolean {
    return spot.getSize() === VehicleSize.Large || spot.getSize() === VehicleSize.Compact;
  }

  print(): string {
    return 'C';
  }
}

export default Car;