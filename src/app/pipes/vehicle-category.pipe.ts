import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleType'
})
export class VehicleTypePipe implements PipeTransform {
  private vehicleTypeNames: { [key in 'CAR' | 'E_BIKE' | 'E_SCOOTER']: string } = {
    'CAR': 'Car',
    'E_BIKE': 'Electric Bike',
    'E_SCOOTER': 'Electric Scooter'
  };

  transform(value: string): string {
    return this.vehicleTypeNames[value as 'CAR' | 'E_BIKE' | 'E_SCOOTER'] || value;
  }
}
