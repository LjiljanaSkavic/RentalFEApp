import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MalfunctionRequest } from "../../model/malfunction";
import { MalfunctionService } from "../../services/malfunction-service";

export interface MalfunctionModalData {
  vehicleId: number;
}

@Component({
  selector: 'app-malfunction-modal',
  templateUrl: './malfunction-modal.component.html',
  styleUrls: ['./malfunction-modal.component.scss']
})
export class MalfunctionModalComponent implements OnInit, OnDestroy {
  malfunctionForm: FormGroup = {} as FormGroup;
  malfunctionRequest: MalfunctionRequest = {} as MalfunctionRequest;
  subscriptions = new Subscription();

  constructor(private _malfunctionService: MalfunctionService,
              private dialogRef: MatDialogRef<MalfunctionModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MalfunctionModalData) {
  }

  ngOnInit(): void {
    this.buildMalfunctionForm();
  }

  buildMalfunctionForm(): void {
    this.malfunctionForm = new FormGroup({
      date: new FormControl(null, Validators.required),
      time: new FormControl(null, [Validators.required,
        Validators.pattern(/^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/)]), //hh:mm:ss
      description: new FormControl(null, Validators.required)
    });
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
      vehicleId: this.data.vehicleId
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
