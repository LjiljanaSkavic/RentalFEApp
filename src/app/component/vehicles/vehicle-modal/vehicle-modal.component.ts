import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Car, ElectricBike, ElectricScooter } from "../../../model/Vehicle";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { UserStoreService } from "../../../services/user-store.service";
import { VehicleService } from "../../../services/vehicle.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface VehicleModalData {
  vehicle: Car | ElectricBike | ElectricScooter;
  vehicleType: string;
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
    console.log(this.data.vehicleType);
    this.buildVehicleForm();
  }

  buildVehicleForm(): void {
    if (this.isEditMode) {
      this.vehicleForm = new FormGroup({
        vehicleCode: new FormControl(this.data.vehicle.vehicleCode, Validators.required),
        model: new FormControl(this.data.vehicle.model, Validators.required),
        purchasePrice: new FormControl(this.data.vehicle.purchasePrice, [Validators.required, Validators.min(0)]),
        status: new FormControl(this.data.vehicle.status, Validators.required),
      });

      if (this.data.vehicleType === 'CAR') {
        this.vehicleForm.addControl('acquisitionDate', new FormControl((this.data.vehicle as Car).acquisitionDate));
        this.vehicleForm.addControl('description', new FormControl((this.data.vehicle as Car).description));
      }

      if (this.data.vehicleType === 'E_BIKE') {
        this.vehicleForm.addControl('rangePerCharge', new FormControl((this.data.vehicle as ElectricBike).rangePerCharge));
      }

      if (this.data.vehicleType === 'E_SCOOTER') {
        this.vehicleForm.addControl('maxSpeed', new FormControl((this.data.vehicle as ElectricScooter).maxSpeed));
      }
    } else {
      this.vehicleForm = new FormGroup({
        vehicleCode: new FormControl(null, Validators.required),
        model: new FormControl(null, Validators.required),
        purchasePrice: new FormControl(null, [Validators.required, Validators.min(0)]),
        status: new FormControl(null, Validators.required),
      });

      if (this.data.vehicleType === 'CAR') {
        this.vehicleForm.addControl('acquisitionDate', new FormControl(null));
        this.vehicleForm.addControl('description', new FormControl(null));

      }

      if (this.data.vehicleType === 'E_BIKE') {
        this.vehicleForm.addControl('rangePerCharge', new FormControl(null));
      }

      if (this.data.vehicleType === 'E_SCOOTER') {
        this.vehicleForm.addControl('maxSpeed', new FormControl(null));
      }
    }
  }


  onDialogClose(): void {
    this.prepareVehicle();
  }

  prepareVehicle(): void {

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
