import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Pricing } from "../../model/Pricing";
import { Subscription } from "rxjs";
import { PricingService } from "../../services/pricing.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface PricingModalData {
    pricing: Pricing;
}

@Component({
    selector: 'app-pricing-modal',
    templateUrl: './pricing-modal.component.html',
    styleUrls: ['./pricing-modal.component.scss']
})
export class PricingModalComponent {
    pricingForm: FormGroup = {} as FormGroup;
    editedPricing: Pricing = {} as Pricing;
    subscriptions = new Subscription();

    constructor(private _pricingService: PricingService,
                private dialogRef: MatDialogRef<PricingModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: PricingModalData) {
    }

    ngOnInit(): void {
        this.buildPricingForm();
    }

    buildPricingForm(): void {
        this.pricingForm = new FormGroup({
            pricePerDay: new FormControl(this.data.pricing.pricePerDay, [Validators.required, Validators.min(0)])
        });
    }

    onDialogClose(): void {
        this.preparePricing();
    }

    preparePricing(): void {
        this.editedPricing = {
            ...this.data.pricing,
            pricePerDay: this.pricingForm.get('pricePerDay')?.value as number
        };
        this.subscriptions.add(
            this._pricingService.update(this.editedPricing.id, this.editedPricing).subscribe(res => {
                this.dialogRef.close(res);
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
