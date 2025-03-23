import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { VehicleService } from "../../services/vehicle.service";
import { EMPTY, Subscription, switchMap } from "rxjs";
import { Vehicle } from "../../model/Vehicle";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { VehicleModalComponent } from "./vehicle-modal/vehicle-modal.component";

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  isLoading = true;
  pageIndex = 0;
  pageSize = 10;
  totalVehicles = 0;
  subscriptions = new Subscription();
  selectedCategory = '';
  dataSource = new MatTableDataSource<Vehicle>(this.vehicles);
  categories = ['All', 'Car', 'Electric Bike', 'Electric Scooter'];
  displayedColumns: string[] = ['id', 'vehicleCode', 'purchasePrice', 'model', 'status', 'edit', 'delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  constructor(private _vehicleService: VehicleService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.selectedCategory = this.categories[0];
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.subscriptions.add(this._vehicleService.getVehicles(this.pageIndex, this.pageSize, this.selectedCategory).subscribe(res => {
      this.vehicles = res.vehicles;
      this.totalVehicles = res.totalElements;
      this.dataSource.data = this.vehicles;
      this.isLoading = false;
    }));
  }

  onAddNewVehicleClick(): void {
    this.dialog.open(VehicleModalComponent, {
      hasBackdrop: true,
      backdropClass: 'rental-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        const calculatedPageIndex = Math.ceil((this.totalVehicles + 1) / this.pageSize);
        this.pageIndex = calculatedPageIndex - 1;
        this.loadVehicles();
      }
    });
  }

  onEditClick(vehicle: any): void {
    if (!vehicle.vehicleType) {
      if (vehicle.acquisitionDate && vehicle.description) {
        vehicle.vehicleType = 'Car';
      } else if (vehicle.rangePerCharge) {
        vehicle.vehicleType = 'ElectricBike';
      } else if (vehicle.maxSpeed) {
        vehicle.vehicleType = 'ElectricScooter';
      }
    }

    console.log(vehicle)

    this.dialog.open(VehicleModalComponent, {
      data: {
        vehicle: vehicle
      },
      hasBackdrop: true,
      backdropClass: 'rental-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        const manufacturerIndex = this.vehicles.findIndex(m => m.id === result.id);

        if (manufacturerIndex !== -1) {
          this.vehicles[manufacturerIndex] = result;
          this.dataSource.data = this.vehicles;
        }
      }
    });
  }

  onDeleteClick(vehicle: Vehicle): void {
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: "Delete vehicle",
        text: "Are you sure that you want to delete this vehicle?"
      },
      hasBackdrop: true,
      backdropClass: 'rental-app-backdrop'
    }).afterClosed()
      .pipe(
        switchMap(result => {
          return result ? this._vehicleService.deleteById(vehicle.id) : EMPTY;
        })
      )
      .subscribe(res => {
        const index = this.vehicles.findIndex(m => m.id === vehicle.id);
        if (index !== -1) {
          this.loadVehicles();
        }
      });
  }

  onCategoryChange(category: any): void {
    this.selectedCategory = category;
    this.loadVehicles();
  }


  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
