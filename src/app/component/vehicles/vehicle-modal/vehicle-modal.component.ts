import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Car, ElectricBike, ElectricScooter, Vehicle } from "../../../model/Vehicle";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { UserStoreService } from "../../../services/user-store.service";
import { VehicleService } from "../../../services/vehicle.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSelectChange } from "@angular/material/select";

export interface VehicleModalData {
  vehicle: Car | ElectricBike | ElectricScooter;
}

@Component({
  selector: 'app-vehicle-modal',
  templateUrl: './vehicle-modal.component.html',
  styleUrls: ['./vehicle-modal.component.scss']
})
export class VehicleModalComponent implements OnInit, OnDestroy {
  vehicleForm: FormGroup = {} as FormGroup;
  // vehicleRequest: VehicleRequest = {} as VehicleRequest;
  userId: number = 0
  isEditMode = false;
  subscriptions = new Subscription();

  constructor(private _userStoreService: UserStoreService,
              private _vehicleService: VehicleService,
              private dialogRef: MatDialogRef<VehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: VehicleModalData) {
  }

  ngOnInit(): void {
    if (this._userStoreService.getIsLoggedIn()) {
      this.userId = this._userStoreService.getLoggedInUser()?.id ?? 0;
    }
    this.isEditMode = this.data !== null;
    this.buildVehicleForm();
  }

  buildVehicleForm(): void {
    if (this.isEditMode) {
      this.vehicleForm = new FormGroup({
        vehicleCode: new FormControl(this.data.vehicle.vehicleCode, Validators.required),
        model: new FormControl(this.data.vehicle.model, Validators.required),
        purchasePrice: new FormControl(this.data.vehicle.purchasePrice, [Validators.required, Validators.min(0)]),
        status: new FormControl(this.data.vehicle.status, Validators.required),
        vehicleType: new FormControl(this.data.vehicle['vehicleType'], Validators.required), // Dynamic field for vehicle type
        // Initialize dynamic fields for each vehicle type based on your data
        acquisitionDate: this.data.vehicle && this.isCar(this.data.vehicle)
          ? new FormControl(this.data.vehicle.acquisitionDate)
          : new FormControl(null),

        description: this.data.vehicle && this.isCar(this.data.vehicle)
          ? new FormControl(this.data.vehicle.description)
          : new FormControl(null),

        rangePerCharge: this.data.vehicle && this.isElectricBike(this.data.vehicle)
          ? new FormControl(this.data.vehicle.rangePerCharge)
          : new FormControl(null),

        maxSpeed: this.data.vehicle && this.isElectricScooter(this.data.vehicle)
          ? new FormControl(this.data.vehicle.maxSpeed)
          : new FormControl(null),
      });
    } else {
      this.vehicleForm = new FormGroup({
        vehicleCode: new FormControl(null, Validators.required),
        model: new FormControl(null, Validators.required),
        purchasePrice: new FormControl(null, [Validators.required, Validators.min(0)]),
        status: new FormControl(null, Validators.required),
        vehicleType: new FormControl(null, Validators.required), // Vehicle type selection
        acquisitionDate: new FormControl(null),
        description: new FormControl(null),
        rangePerCharge: new FormControl(null),
        maxSpeed: new FormControl(null),
      });
    }
  }

  // Type guards to determine the vehicle type
  isCar(vehicle: Vehicle): vehicle is Car {
    return (vehicle as Car).acquisitionDate !== undefined;
  }

  isElectricBike(vehicle: Vehicle): vehicle is ElectricBike {
    return (vehicle as ElectricBike).rangePerCharge !== undefined;
  }

  isElectricScooter(vehicle: Vehicle): vehicle is ElectricScooter {
    return (vehicle as ElectricScooter).maxSpeed !== undefined;
  }


  onDialogClose(): void {
    this.prepareVehicle();
  }

  prepareVehicle(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onVehicleTypeChange(event: MatSelectChange): void {
    const vehicleType = event.value;
    if (vehicleType === 'Car') {
      this.vehicleForm.addControl('acquisitionDate', new FormControl(null, Validators.required));
      this.vehicleForm.addControl('description', new FormControl(null, Validators.required));
    } else {
      this.vehicleForm.removeControl('acquisitionDate');
      this.vehicleForm.removeControl('description');
    }

    if (vehicleType === 'ElectricBike') {
      this.vehicleForm.addControl('rangePerCharge', new FormControl(null, Validators.required));
    } else {
      this.vehicleForm.removeControl('rangePerCharge');
    }

    if (vehicleType === 'ElectricScooter') {
      this.vehicleForm.addControl('maxSpeed', new FormControl(null, Validators.required));
    } else {
      this.vehicleForm.removeControl('maxSpeed');
    }
  }
}
