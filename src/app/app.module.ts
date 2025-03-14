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
import { VehicleDetailsComponent } from './component/vehicle-details/vehicle-details.component';
import { RentalComponent } from './component/rental/rental.component';
import { ProfileDetailsModalComponent } from "./component/profile-details/profile-details-modal.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";

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
  MatSnackBarModule
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
    ProfileDetailsModalComponent,
    RentalComponent
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
