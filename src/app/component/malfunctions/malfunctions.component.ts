import { Component, ViewChild } from '@angular/core';
import { Malfunction } from 'src/app/model/Malfunction';
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MalfunctionService } from "../../services/malfunction-service";
import { MalfunctionModalComponent } from "../malfunction-modal/malfunction-modal.component";

@Component({
  selector: 'app-malfunctions',
  templateUrl: './malfunctions.component.html',
  styleUrls: ['./malfunctions.component.scss']
})
export class MalfunctionsComponent {
  malfunctions: Malfunction[] = [];
  isLoading = true;
  pageIndex = 0;
  pageSize = 10;
  totalMalfunctions = 0;
  subscriptions = new Subscription();

  displayedColumns: string[] = ['id', 'date', 'time', 'description', 'vehicleId'];
  dataSource = new MatTableDataSource<Malfunction>(this.malfunctions);

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  constructor(private _malfunctionService: MalfunctionService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadMalfunctions();
  }

  loadMalfunctions(): void {
    this.isLoading = true;
    this.subscriptions.add(this._malfunctionService.getAll(this.pageIndex, this.pageSize).subscribe(res => {
      this.malfunctions = res.data;
      this.totalMalfunctions = res.totalElements;
      this.dataSource.data = this.malfunctions;
      this.isLoading = false;
    }));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMalfunctions();
  }

  onAddNewMalfunctionClick(): void {
    this.dialog.open(MalfunctionModalComponent, {
      data: {
        origin: 'Malfunctions'
      },
      hasBackdrop: true,
      backdropClass: 'rentals-app-backdrop'
    }).afterClosed().subscribe(result => {
      if (result) {
        const calculatedPageIndex = Math.ceil((this.totalMalfunctions + 1) / this.pageSize);
        this.pageIndex = calculatedPageIndex - 1;
        this.loadMalfunctions();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
