import { AbstractVehicle, VehicleProps } from './vehicle';
import ParkingSpot from './parkingSpot';
import { VehicleSize } from './vehicleSize';

class Bus extends AbstractVehicle {
  constructor(props: Partial<VehicleProps> = {}) {
    super({
      spotsNeeded: 5,
      size: VehicleSize.Large,
      ...props
    });
  }

  canFitInSpot(spot: ParkingSpot): boolean {
    return spot.getSize() === VehicleSize.Large;
  }

  print(): string {
    return 'B';
  }
}

export default Bus;