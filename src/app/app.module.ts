import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { VehiclesComponent } from './component/vehicles/vehicles.component';
import { ManufacturersComponent } from './component/manufacturers/manufacturers.component';
import { UsersComponent } from './component/users/users.component';
import { StatisticsComponent } from './component/statistics/statistics.component';
import { VehicleDetailsComponent } from './component/vehicles/vehicle-details/vehicle-details.component';
import { RentalsComponent } from './component/rentals/rentals.component';
import { UserModalComponent } from "./component/user-modal/user-modal.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ManagePasswordModalComponent } from './component/manage-password-modal/manage-password-modal.component';
import { MatPaginatorModule } from "@angular/material/paginator";
import { ManufacturerModalComponent } from './component/manufacturers/manufacturer-modal/manufacturer-modal.component';
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { ConfirmationModalComponent } from "./component/confirmation-modal/confirmation-modal.component";
import { MatSelectModule } from "@angular/material/select";
import { VehicleModalComponent } from './component/vehicles/vehicle-modal/vehicle-modal.component';
import { VehicleTypePipe } from "./pipes/vehicle-category.pipe";
import { UserTypePipe } from "./pipes/user-type.pipe";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MalfunctionModalComponent } from './component/malfunction-modal/malfunction-modal.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { CarouselComponent } from "./component/carousel/carousel.component";
import { RentalComponent } from './component/rentals/rental/rental.component';
import { MalfunctionComponent } from './component/malfunction-modal/malfunction/malfunction.component';
import { PricingComponent } from './component/pricing/pricing.component';
import { PricingModalComponent } from './component/pricing-modal/pricing-modal.component';
import { MalfunctionsComponent } from './component/malfunctions/malfunctions.component';
import { VehicleMapComponent } from './component/vehicle-map/vehicle-map.component';

export const ANGULAR_MATERIAL_MODULES = [
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule
]

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        VehiclesComponent,
        ManufacturersComponent,
        UsersComponent,
        StatisticsComponent,
        VehicleDetailsComponent,
        UserModalComponent,
        RentalsComponent,
        ManagePasswordModalComponent,
        ManufacturerModalComponent,
        ConfirmationModalComponent,
        VehicleModalComponent,
        VehicleTypePipe,
        UserTypePipe,
        MalfunctionModalComponent,
        CarouselComponent,
        RentalComponent,
        MalfunctionComponent,
        PricingComponent,
        PricingModalComponent,
        MalfunctionsComponent,
        VehicleMapComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ANGULAR_MATERIAL_MODULES,
    ],
    providers: [HttpClient],
    bootstrap: [AppComponent]
})
export class AppModule {
}
