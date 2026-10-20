import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from '../bookings/bookings.component';
import { HomeComponent } from './home/home.component';
import { MovieDetailsComponent } from './payment/movie-details/movie-details.component';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path:"home", component: HomeComponent },
  { path:"movie/:id", component: MovieDetailsComponent },
  { path:"payment/:bookingId", component: PaymentComponent },
  { path:"bookings", component: BookingsComponent },
  { path:"profile", component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
