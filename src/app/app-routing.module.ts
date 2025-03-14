import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesComponent } from "./component/vehicles/vehicles.component";
import { ManufacturersComponent } from "./component/manufacturers/manufacturers.component";
import { UsersComponent } from "./component/users/users.component";
import { StatisticsComponent } from "./component/statistics/statistics.component";
import { VehicleDetailsComponent } from "./component/vehicle-details/vehicle-details.component";
import { ProfileDetailsModalComponent } from "./component/profile-details/profile-details-modal.component";
import { RentalComponent } from "./component/rental/rental.component";

const routes: Routes = [
  {
    path: '',
    component: VehiclesComponent,
    pathMatch: 'full'
  },
  {
    path: "vehicles",
    component: VehiclesComponent
  },
  {
    path: "vehicles/:id",
    component: VehicleDetailsComponent
  },
  {
    path: "manufacturers",
    component: ManufacturersComponent
  },
  {
    path: "users",
    component: UsersComponent
  },
  {
    path: "rentals",
    component: RentalComponent
  },
  {
    path: "statistics",
    component: StatisticsComponent
  },
  {
    path: "profile-details-modal/:id",
    component: ProfileDetailsModalComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
