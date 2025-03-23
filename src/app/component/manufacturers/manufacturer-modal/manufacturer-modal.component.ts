import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Manufacturer, ManufacturerRequest } from "../../../model/Manufacturer";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserStoreService } from "../../../services/user-store.service";
import { ManufacturersService } from "../../../services/manufacturers.service";

export interface ManufacturerModalData {
  manufacturer: Manufacturer;
}

@Component({
  selector: 'app-manufacturer-modal',
  templateUrl: './manufacturer-modal.component.html',
  styleUrls: ['./manufacturer-modal.component.scss']
})
export class ManufacturerModalComponent implements OnInit, OnDestroy {
  manufacturerForm: FormGroup = {} as FormGroup;
  manufacturerRequest: ManufacturerRequest = {} as ManufacturerRequest;
  userId: number = 0
  isEditMode = false;
  subscriptions = new Subscription();

  constructor(private _userStoreService: UserStoreService,
              private _manufacturerService: ManufacturersService,
              private dialogRef: MatDialogRef<ManufacturerModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ManufacturerModalData) {
  }

  ngOnInit(): void {
    if (this._userStoreService.getIsLoggedIn()) {
      this.userId = this._userStoreService.getLoggedInUser()?.id ?? 0;
    }
    this.isEditMode = this.data !== null;
    this.buildManufacturerForm();
  }

  buildManufacturerForm(): void {
    if (this.isEditMode) {
      this.manufacturerForm = new FormGroup({
        name: new FormControl(this.data.manufacturer.name, Validators.required),
        country: new FormControl(this.data.manufacturer.country, Validators.required),
        address: new FormControl(this.data.manufacturer.address, Validators.required),
        email: new FormControl(this.data.manufacturer.email, [Validators.required, Validators.email]),
        phone: new FormControl(this.data.manufacturer.phone, [Validators.required, Validators.pattern('^\\+?[0-9]{1,4}?[-.\\s]?[0-9]{1,3}[-.\\s]?[0-9]{4,10}$')]),
        fax: new FormControl(this.data.manufacturer.fax, [Validators.pattern('^\\+?[0-9]{1,4}?[-.\\s]?[0-9]{1,3}[-.\\s]?[0-9]{4,10}$')])
      });
    } else {
      this.manufacturerForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        country: new FormControl(null, Validators.required),
        address: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, [Validators.required, Validators.pattern('^\\+?[0-9]{1,4}?[-.\\s]?[0-9]{1,3}[-.\\s]?[0-9]{4,10}$')]),
        fax: new FormControl(null, [Validators.pattern('^[0-9]*$')])
      });
    }
  }

  onDialogClose(): void {
    this.prepareManufacturer();
  }

  prepareManufacturer(): void {
    this.manufacturerRequest = {
      name: this.manufacturerForm.get('name')?.value as string,
      country: this.manufacturerForm.get('country')?.value as string,
      address: this.manufacturerForm.get('address')?.value as string,
      email: this.manufacturerForm.get('email')?.value as string,
      phone: this.manufacturerForm.get('phone')?.value,
      fax: this.manufacturerForm.get('fax')?.value as string
    }

    if (this.isEditMode) {
      const manufacturerId = this.data.manufacturer.id;
      this.subscriptions.add(
        this._manufacturerService.updateManufacturer(this.manufacturerRequest, manufacturerId).subscribe(res => {
          this.dialogRef.close(res);
        }));
    } else {
      this.subscriptions.add(
        this._manufacturerService.createManufacturer(this.manufacturerRequest).subscribe(res => {
          this.dialogRef.close(res);
        }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
