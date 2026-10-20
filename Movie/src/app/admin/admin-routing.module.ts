import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { AddTheaterComponent } from './add-theater/add-theater.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';
import { ManageShowsComponent } from './manage-shows/manage-shows.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const routes: Routes = [
  
    { path: "", component: DashboardComponent },
    { path: "add-movie", component: AddMovieComponent },
    { path: "add-theater", component: AddTheaterComponent },
    { path: "manage-shows", component: ManageShowsComponent },
    { path: "manage-bookings", component: ManageBookingsComponent },
    { path: "manage-users", component: ManageUsersComponent },
    { path: "add-admin", component: AddAdminComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
