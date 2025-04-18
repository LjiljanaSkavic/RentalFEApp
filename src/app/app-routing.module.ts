import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesComponent } from "./component/vehicles/vehicles.component";
import { ManufacturersComponent } from "./component/manufacturers/manufacturers.component";
import { UsersComponent } from "./component/users/users.component";
import { StatisticsComponent } from "./component/statistics/statistics.component";
import { VehicleDetailsComponent } from "./component/vehicles/vehicle-details/vehicle-details.component";
import { UserModalComponent } from "./component/user-modal/user-modal.component";
import { RentalsComponent } from "./component/rentals/rentals.component";
import { PricingComponent } from "./component/pricing/pricing.component";
import { MalfunctionsComponent } from "./component/malfunctions/malfunctions.component";
import { VehicleMapComponent } from "./component/vehicle-map/vehicle-map.component";

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
        component: RentalsComponent
    },
    {
        path: "statistics",
        component: StatisticsComponent
    },
    {
        path: "user-modal-modal/:id",
        component: UserModalComponent
    },
    {
        path: "pricing",
        component: PricingComponent
    },
    {
        path: "malfunctions",
        component: MalfunctionsComponent
    },
    {
        path: "vehicle-map",
        component: VehicleMapComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
