import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MalfunctionRequest } from "../../model/Malfunction";
import { MalfunctionService } from "../../services/malfunction-service";
import { VehicleShort } from "../../model/VehicleShort";
import { VehicleService } from "../../services/vehicle.service";

export type MalfunctionModalOrigin = 'Vehicle details' | 'Malfunctions'

export interface MalfunctionModalData {
  vehicleId: number;
  origin: MalfunctionModalOrigin
}

@Component({
  selector: 'app-malfunction-modal',
  templateUrl: './malfunction-modal.component.html',
  styleUrls: ['./malfunction-modal.component.scss']
})
export class MalfunctionModalComponent implements OnInit, OnDestroy {
  malfunctionForm: FormGroup = {} as FormGroup;
  malfunctionRequest: MalfunctionRequest = {} as MalfunctionRequest;
  vehicles: VehicleShort[] = [];
  subscriptions = new Subscription();
  selectedVehicle: VehicleShort = {} as VehicleShort;

  constructor(private _malfunctionService: MalfunctionService,
              private _vehicleService: VehicleService,
              private dialogRef: MatDialogRef<MalfunctionModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MalfunctionModalData) {
  }

  ngOnInit(): void {
    if (this.data.origin === 'Malfunctions') {
      this.getVehicles();
    }
    this.buildMalfunctionForm();
  }

  buildMalfunctionForm(): void {
    this.malfunctionForm = new FormGroup({
      date: new FormControl(null, Validators.required),
      time: new FormControl(null, [Validators.required,
        Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/)]), //hh:mm:ss
      description: new FormControl(null, Validators.required),
      vehicleId: new FormControl(this.data.origin === 'Malfunctions' ? null : this.data.vehicleId, Validators.required),
    });
  }

  getVehicles(): void {
    this.subscriptions.add(
      this._vehicleService.getAllShort().subscribe(res => {
        this.vehicles = res;
      })
    )
  }

  onDialogClose(): void {
    this.saveMalfunction();
  }

  saveMalfunction(): void {
    this.malfunctionRequest = {
      date: this.malfunctionForm.get('date')?.value as Date,
      time: this.malfunctionForm.get('time')?.value as string,
      description: this.malfunctionForm.get('description')?.value as string,
      isDeleted: false,
      vehicleId: this.malfunctionForm.get('vehicleId')?.value
    };

    this.subscriptions.add(
      this._malfunctionService.create(this.malfunctionRequest).subscribe(res => {
        this.dialogRef.close(res);
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
