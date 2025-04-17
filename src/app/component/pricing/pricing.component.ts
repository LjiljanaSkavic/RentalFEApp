import { Component, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PricingService } from "../../services/pricing.service";
import { MatPaginator } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { Pricing } from "../../model/Pricing";
import { MatTableDataSource } from "@angular/material/table";
import { PricingModalComponent } from "../pricing-modal/pricing-modal.component";

@Component({
    selector: 'app-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss']
})
export class PricingComponent {
    pricings: Pricing[] = [];
    isLoading = true;
    subscriptions = new Subscription();

    displayedColumns: string[] = ['id', 'vehicleType', 'pricePerDay', 'edit'];
    dataSource = new MatTableDataSource<Pricing>(this.pricings);

    @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

    constructor(
        private _pricingService: PricingService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.loadPricings();
    }

    loadPricings(): void {
        this.isLoading = true;
        this.subscriptions.add(
            this._pricingService.getAll().subscribe(res => {
                this.pricings = res;
                this.dataSource.data = this.pricings;
                this.isLoading = false;
            })
        );
    }

    onEditClick(pricing: Pricing): void {
        this.dialog.open(PricingModalComponent, {
            data: {pricing},
            hasBackdrop: true,
            backdropClass: 'rentals-app-backdrop'
        }).afterClosed().subscribe(result => {
            if (result) {
                const index = this.pricings.findIndex(p => p.id === result.id);
                if (index !== -1) {
                    this.pricings[index] = result;
                    this.dataSource.data = this.pricings;
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
