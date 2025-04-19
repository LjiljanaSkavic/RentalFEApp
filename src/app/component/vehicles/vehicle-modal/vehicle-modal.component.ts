import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Car, ElectricBike, ElectricScooter, VehicleCategory, VehicleStatus } from "../../../model/Vehicle";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription, switchMap } from "rxjs";
import { UserStoreService } from "../../../services/user-store.service";
import { VehicleService } from "../../../services/vehicle.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { VehicleRequest } from "../../../model/VehicleRequest";
import { isObjectEmpty } from "../../../shared/utils/is-empty";
import { ManufacturersService } from "../../../services/manufacturers.service";
import { Manufacturer } from "../../../model/Manufacturer";
import { FileService } from "../../../services/files.service";

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
  vehicleRequest: VehicleRequest = {} as VehicleRequest;
  userId: number = 0
  isEditMode = false;
  manufactures: Manufacturer[] = [];
  subscriptions = new Subscription();
  fileUrl: string | ArrayBuffer | null = null;
  fileUrlOriginal: string | null = null;
  selectedFileName = '';
  selectedFile: File | null = null;

  constructor(private _fileService: FileService,
              private _userStoreService: UserStoreService,
              private _vehicleService: VehicleService,
              private _manufacturersService: ManufacturersService,
              private dialogRef: MatDialogRef<VehicleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: VehicleModalData) {
  }

  ngOnInit(): void {
    if (this._userStoreService.getIsLoggedIn()) {
      this.userId = this._userStoreService.getLoggedInUser()?.id ?? 0;
    }
    this.isEditMode = !isObjectEmpty(this.data.vehicle);
    this.subscriptions.add(this._manufacturersService.getManufacturers(0, 50).subscribe(res => {
      this.manufactures = res.data;
    }))
    this.buildVehicleForm();
    if (this.data.vehicle.image) {
      this.getFile();
      this.selectedFileName = this.data.vehicle.image.name;
    } else {
      //TODO: Put here file urls to null or empty string
    }
  }

  buildVehicleForm(): void {
    if (this.isEditMode) {
      this.vehicleForm = new FormGroup({
        code: new FormControl(this.data.vehicle.code, Validators.required),
        model: new FormControl(this.data.vehicle.model, Validators.required),
        purchasePrice: new FormControl(this.data.vehicle.purchasePrice, [Validators.required, Validators.min(0)]),
        status: new FormControl(this.data.vehicle.status, Validators.required),
        manufacturerId: new FormControl(this.data.vehicle.manufacturer.id, Validators.required),
        imageName: new FormControl(this.data.vehicle.image.name || null)
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
        code: new FormControl(null, Validators.required),
        model: new FormControl(null, Validators.required),
        purchasePrice: new FormControl(null, [Validators.required, Validators.min(0)]),
        status: new FormControl(null, Validators.required),
        manufacturerId: new FormControl(null, Validators.required),
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

  getFile(): void {
    this.subscriptions.add(
      this._fileService.getFileById(this.data.vehicle?.image.id ?? 0).subscribe(
        (data: Blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onloadend = () => {
            this.fileUrl = reader.result;
            this.fileUrlOriginal = reader.result as string;
          };
        },
        error => {
          //TODO: Handle error
          console.error('Error retrieving file:', error);
        }
      ));
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.displaySelectedFile(file);
    }
    this.selectedFile = event.target.files[0];
  }

  displaySelectedFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.fileUrl = event.target?.result?.toString() ?? null;
      this.selectedFileName = file.name;
      this.vehicleForm.get('imageName')?.setValue(file.name);
    };
    reader.readAsDataURL(file);
  }

  onDialogClose(): void {
    this.prepareVehicle();
  }

  prepareVehicle(): void {
    this.vehicleRequest = {
      category: this.data.vehicleType as VehicleCategory,
      code: this.vehicleForm.get('code')?.value as string,
      model: this.vehicleForm.get('model')?.value as string,
      purchasePrice: this.vehicleForm.get('purchasePrice')?.value as number,
      status: this.vehicleForm.get('status')?.value as VehicleStatus,
      acquisitionDate: this.vehicleForm.get('acquisitionDate')?.value as Date,
      description: this.vehicleForm.get('description')?.value as string,
      rangePerCharge: this.vehicleForm.get('rangePerCharge')?.value as number,
      maxSpeed: this.vehicleForm.get('maxSpeed')?.value as number,
      manufacturerId: this.vehicleForm.get('manufacturerId')?.value as number,
      vehiclePictureId: this.data.vehicle.id
    };

    if (this.data.vehicleType === 'CAR') {
      this.vehicleRequest.acquisitionDate = this.vehicleForm.get('acquisitionDate')?.value as Date;
      this.vehicleRequest.description = this.vehicleForm.get('description')?.value as string;
    }

    if (this.data.vehicleType === 'E_BIKE') {
      this.vehicleRequest.rangePerCharge = this.vehicleForm.get('rangePerCharge')?.value as number;
    }

    if (this.data.vehicleType === 'E_SCOOTER') {
      this.vehicleRequest.maxSpeed = this.vehicleForm.get('maxSpeed')?.value as number;
    }

    if (this.isEditMode) {
      const vehicleId = this.data.vehicle.id;
      if (this.selectedFileName !== this.data.vehicle.image.name) {
        this.subscriptions.add(this._fileService.uploadFile(this.selectedFile).pipe(
          switchMap((res) => {
            this.vehicleRequest.vehiclePictureId = res.id;
            return this._vehicleService.update(this.vehicleRequest, vehicleId);
          })
        ).subscribe(
          (res) => {
            this.dialogRef.close(res);
          }
        ));
      }
    } else {
      this.subscriptions.add(this._fileService.uploadFile(this.selectedFile).pipe(
        switchMap((res) => {
          this.vehicleRequest.vehiclePictureId = res.id;
          return this._vehicleService.create(this.vehicleRequest);
        })
      ).subscribe(
        (res) => {
          this.dialogRef.close(res);
        }
      ));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
