import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Subscription, switchMap } from "rxjs";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { Manufacturer } from "../../model/Manufacturer";
import { ManufacturersService } from "../../services/manufacturers.service";
import { ConfirmationModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { ManufacturerModalComponent } from "./manufacturer-modal/manufacturer-modal.component";

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.scss']
})
export class ManufacturersComponent implements OnInit, OnDestroy {
  manufacturers: Manufacturer[] = [];
  isLoading = true;
  pageIndex = 0;
  pageSize = 10;
  totalManufacturers = 0;
  subscriptions = new Subscription();

  displayedColumns: string[] = ['id', 'name', 'country', 'address', 'email', 'phone', 'fax', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Manufacturer>(this.manufacturers);

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  constructor(private _manufacturersService: ManufacturersService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadManufacturers();
  }

  loadManufacturers(): void {
    this.isLoading = true;
    this.subscriptions.add(this._manufacturersService.getManufacturers(this.pageIndex, this.pageSize).subscribe(res => {
      this.manufacturers = res.data;
      this.totalManufacturers = res.totalElements;
      this.dataSource.data = this.manufacturers;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadManufacturers();
  }

  onEditClick(manufacturer: Manufacturer): void {
    this.dialog.open(ManufacturerModalComponent, {
      data: {
        manufacturer: manufacturer
      },
      hasBackdrop: true,
      backdropClass: 'rentals-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        const manufacturerIndex = this.manufacturers.findIndex(m => m.id === result.id);

        if (manufacturerIndex !== -1) {
          this.manufacturers[manufacturerIndex] = result;
          this.dataSource.data = this.manufacturers;
        }
      }
    });
  }

  onDeleteClick(manufacturer: Manufacturer): void {
    this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: "Delete manufacturer",
        text: "Are you sure that you want to delete this manufacturer?"
      },
      hasBackdrop: true,
      backdropClass: 'rentals-app-backdrop'
    }).afterClosed()
      .pipe(
        switchMap(result => {
          return result ? this._manufacturersService.deleteById(manufacturer.id) : EMPTY;
        })
      )
      .subscribe(res => {
        const index = this.manufacturers.findIndex(m => m.id === manufacturer.id);
        if (index !== -1) {
          this.loadManufacturers();
        }
      });
  }

  onAddNewManufacturerClick(): void {
    this.dialog.open(ManufacturerModalComponent, {
      hasBackdrop: true,
      backdropClass: 'rentals-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        const calculatedPageIndex = Math.ceil((this.totalManufacturers + 1) / this.pageSize);
        this.pageIndex = calculatedPageIndex - 1;
        this.loadManufacturers();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
