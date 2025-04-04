import { AbstractVehicle, VehicleProps } from './vehicle';
import ParkingSpot from './parkingSpot';
import { VehicleSize } from './vehicleSize';

class Motorcycle extends AbstractVehicle {
  constructor(props: Partial<VehicleProps> = {}) {
    super({
      spotsNeeded: 1,
      size: VehicleSize.Motorcycle,
      ...props
    });
  }

  canFitInSpot(spot: ParkingSpot): boolean {
    return true;
  }

  print(): string {
    return 'M';
  }
}

export default Motorcycle;