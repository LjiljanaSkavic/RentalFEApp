import { Component } from '@angular/core';
import { Vehicle } from "../../../model/Vehicle";

export interface VehicleModalData {
  vehicle: Vehicle;
}

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent {
}
