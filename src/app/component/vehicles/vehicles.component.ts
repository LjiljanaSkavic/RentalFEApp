import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { VehicleService } from "../../services/vehicle.service";
import { EMPTY, Subscription, switchMap } from "rxjs";
import { Car, ElectricBike, ElectricScooter, Vehicle } from "../../model/Vehicle";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { VehicleModalComponent } from "./vehicle-modal/vehicle-modal.component";
import { Router } from "@angular/router";
import { MalfunctionModalComponent } from '../malfunction-modal/malfunction-modal.component';
import { snackBarConfig } from "../../shared/constants";
import { MatSnackBar } from "@angular/material/snack-bar";

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
    categories = ['CAR', 'E_BIKE', 'E_SCOOTER'];
    displayedColumns: string[] = ['id', 'vehicleCode', 'purchasePrice', 'model', 'status', 'edit', 'delete', 'add-malfunction'];
    @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
    @ViewChild('fileInput') fileInput: any;

    constructor(private _vehicleService: VehicleService,
                private _router: Router,
                private _snackBar: MatSnackBar,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.selectedCategory = this.categories[0];
        this.loadVehicles();
    }

    loadVehicles(): void {
        this.isLoading = true;
        this.subscriptions.add(this._vehicleService.getVehicles(this.pageIndex, this.pageSize, this.selectedCategory).subscribe(res => {
            this.vehicles = res.data;
            this.totalVehicles = res.totalElements;
            this.dataSource.data = this.vehicles;
            this.isLoading = false;
        }));
    }

    onAddNewVehicleClick(): void {
        let newVehicle;
        if (this.selectedCategory === 'CAR') {
            newVehicle = {} as Car;
        }

        if (this.selectedCategory === 'E_BIKE') {
            newVehicle = {} as ElectricBike;
        }

        if (this.selectedCategory === 'E_SCOOTER') {
            newVehicle = {} as ElectricScooter;
        }

        this.dialog.open(VehicleModalComponent, {
            data: {
                vehicle: newVehicle,
                vehicleType: this.selectedCategory
            },
            hasBackdrop: true,
            backdropClass: 'rentals-app-backdrop'
        }).afterClosed().subscribe(result => {
            if (result) {
                const calculatedPageIndex = Math.ceil((this.totalVehicles + 1) / this.pageSize);
                this.pageIndex = calculatedPageIndex - 1;
                this.loadVehicles();
            }
        });
    }

    onEditClick(vehicle: any): void {
        this.dialog.open(VehicleModalComponent, {
            data: {
                vehicle: vehicle,
                vehicleType: this.selectedCategory
            },
            hasBackdrop: true,
            backdropClass: 'rentals-app-backdrop'
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

    onAddMalfunctionClick(vehicle: Vehicle): void {
        this.dialog.open(MalfunctionModalComponent, {
            data: {
                vehicleId: vehicle.id
            },
            hasBackdrop: true,
            backdropClass: 'rentals-app-backdrop'
        }).afterClosed().subscribe(result => {
            if (result) {
                this._snackBar.open("Malfunction successfully added.", "OK", snackBarConfig);
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
            backdropClass: 'rentals-app-backdrop'
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

    onRowClick(vehicle: Vehicle): void {
        this._router.navigate([`vehicles/${vehicle.id}`],
            {queryParams: {type: this.selectedCategory}}).catch(err => console.log(err));
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadVehicles();
    }

    onUploadVehicleClick(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input?.files?.[0];

        if (file) {
            if (file.type !== 'text/csv') {
                this._snackBar.open('Please upload a valid CSV file.', 'Close', {duration: 3000});
                return;
            }

            this.readCSVFile(file);
        }
    }

    readCSVFile(file: File): void {
        const reader = new FileReader();

        reader.onload = () => {
            const csvData = reader.result as string;

            // Manually parse the CSV content
            const lines = csvData.split('\n');
            const headers = lines[0].split(',');  // Assuming the first line is the header
            const rows = [];

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(',');
                if (row.length === headers.length) {
                    const rowData = headers.reduce((acc: any, header: string, index: number) => {
                        acc[header.trim()] = row[index].trim();
                        return acc;
                    }, {});
                    rows.push(rowData);
                }
            }
            //TODO: Add code when BE is finished
            this._snackBar.open('Vehicle uploaded successfully!', 'Close', {duration: 3000});
        };

        reader.onerror = () => {
            this._snackBar.open('Error reading file.', 'Close', {duration: 3000});
        };

        reader.readAsText(file);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
