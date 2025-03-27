import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Rental } from "../../model/Rental";
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { RentalService } from "../../services/rental.service";

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})
export class RentalComponent implements OnInit, OnDestroy {
  rentals: Rental[] = [];
  isLoading = true;
  pageIndex = 0;
  pageSize = 10;
  totalRentals = 0;
  subscriptions = new Subscription();
  selectedCategory = '';
  dataSource = new MatTableDataSource<Rental>(this.rentals);
  categories = ['CAR', 'E_BIKE', 'E_SCOOTER'];
  displayedColumns: string[] = ['id', 'start', 'end', 'startLocation', 'endLocation', 'duration', 'identificationCard', 'driverLicence', 'userFirstAndLastName', 'vehicleCodeAndModel'];
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  constructor(private _rentalService: RentalService) {
  }

  ngOnInit(): void {
    this.loadRentals();
  }

  loadRentals(): void {
    this.isLoading = true;
    this.subscriptions.add(this._rentalService.getRentals(this.pageIndex, this.pageSize).subscribe(res => {
      this.rentals = res.data;
      this.totalRentals = res.totalElements;
      this.dataSource.data = this.rentals;
      this.isLoading = false;
    }));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRentals();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
