import { Component, OnDestroy, OnInit } from '@angular/core';
import { CarDetails, ElectricBikeDetails, ElectricScooterDetails, Vehicle } from "../../../model/Vehicle";
import { EMPTY, Subscription, switchMap } from "rxjs";
import { VehicleService } from "../../../services/vehicle.service";
import { ActivatedRoute } from "@angular/router";
import { FileService } from "../../../services/files.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MalfunctionService } from "../../../services/malfunction-service";
import { ConfirmationModalComponent } from "../../confirmation-modal/confirmation-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { MalfunctionModalComponent } from "../../malfunction-modal/malfunction-modal.component";
import { snackBarConfig } from "../../../shared/constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Manufacturer } from "../../../model/Manufacturer";

export interface VehicleModalData {
  vehicle: Vehicle;
}

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit, OnDestroy {
  id = 0;
  isLoading = true;
  vehicleDetails: CarDetails | ElectricBikeDetails | ElectricScooterDetails = {} as any;
  subscription = new Subscription();
  vehicleImageUrls: string[] = []
  vehicleForm: FormGroup = {} as FormGroup;
  vehicleType: string = '';
  manufacturer: Manufacturer = {} as Manufacturer;

  constructor(private _vehicleService: VehicleService,
              private _activatedRoute: ActivatedRoute,
              private _fileService: FileService,
              private _malfunctionService: MalfunctionService,
              private _snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subscription.add(this._activatedRoute.queryParams.subscribe(queryParams => {
      this.vehicleType = queryParams['type'];
    }));
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.subscription.add(
      this._activatedRoute.params.pipe(
        switchMap(params => {
          this.id = params['id'];
          return this._vehicleService.getById(this.id);
        })
      ).subscribe(res => {
        this.vehicleDetails = res;
        this.getImageUrl(res.image.id);
        this.buildForm();
      })
    );
  }

  buildForm(): void {
    if (!this.vehicleDetails) return;

    this.vehicleForm = new FormGroup({
      uuid: new FormControl(this.vehicleDetails.uuid),
      model: new FormControl(this.vehicleDetails.model, Validators.required),
      purchasePrice: new FormControl(this.vehicleDetails.purchasePrice, [Validators.required, Validators.min(0)]),
      status: new FormControl(this.vehicleDetails.status, Validators.required),
      manufacturer: new FormControl(this.vehicleDetails.manufacturer.id, Validators.required),
    });

    if (this.vehicleType === 'CAR') {
      this.vehicleForm.addControl('acquisitionDate', new FormControl((this.vehicleDetails as CarDetails).acquisitionDate));
      this.vehicleForm.addControl('description', new FormControl((this.vehicleDetails as CarDetails).description));
    }

    if (this.vehicleType === 'E_BIKE') {
      this.vehicleForm.addControl('rangePerCharge', new FormControl((this.vehicleDetails as ElectricBikeDetails).rangePerCharge));
    }

    if (this.vehicleType === 'E_SCOOTER') {
      this.vehicleForm.addControl('maxSpeed', new FormControl((this.vehicleDetails as ElectricScooterDetails).maxSpeed));
    }

    this.vehicleForm.disable();
  }


  getImageUrl(id: number): void {
    this.subscription.add(this._fileService.getFileById(id).subscribe(res => {
      this.vehicleImageUrls[0] = URL.createObjectURL(res);
      this.isLoading = false;
    }));
  }

  onEditVehicleClick(): void {

  }

  onDeleteVehicleClick(): void {

  }

  onAddMalfunction(): void {
    this.dialog.open(MalfunctionModalComponent, {
      data: {
        vehicleId: this.vehicleDetails.id,
        origin: 'Vehicle details'
      },
      hasBackdrop: true,
      backdropClass: 'rentals-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this._snackBar.open("Malfunction successfully added.", "OK", snackBarConfig);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDeleteMalfunction(malfunctionId: number): void {
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: "Delete malfunction",
        text: "Are you sure that you want to delete this malfunction?"
      },
      hasBackdrop: true,
      backdropClass: 'rentals-app-backdrop'
    }).afterClosed()
      .pipe(
        switchMap(result => {
          return result ? this._malfunctionService.deleteById(malfunctionId) : EMPTY;
        })
      ).subscribe(res => {
      this.vehicleDetails.malfunctions = this.vehicleDetails.malfunctions.filter(malfunction => malfunction.id !== malfunctionId);
      this._snackBar.open("Malfunction successfully deleted.", "OK", snackBarConfig);
    });
  }
}
