import { Routes } from '@angular/router';

import { HomeComponent } from './user/home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AddMovieComponent } from './admin/add-movie/add-movie.component';
import { AddTheaterComponent } from './admin/add-theater/add-theater.component';
import { AddAdminComponent } from './admin/add-admin/add-admin.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ManageBookingsComponent } from './admin/manage-bookings/manage-bookings.component';
import { ManageShowsComponent } from './admin/manage-shows/manage-shows.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { BookingsComponent } from './bookings/bookings.component';
import { PaymentComponent } from './user/payment/payment.component';
import { TicketComponent } from './user/ticket/ticket.component';
import { ProfileComponent } from './user/profile/profile.component';
import { MyBookingsComponent } from './user/my-bookings/my-bookings.component';

export const routes: Routes = [

{ path:'', component: HomeComponent },

{ path:'login', component: LoginComponent },

{ path:'register', component: RegisterComponent },

{ path:'admin/dashboard', component: DashboardComponent },

{ path:'admin/add-movie', component: AddMovieComponent },

{ path:'admin/add-theater', component: AddTheaterComponent },

{ path:'admin/add-admin', component: AddAdminComponent },

{ path:'admin/manage-users', component: ManageUsersComponent },

{ path:'admin/manage-bookings', component: ManageBookingsComponent },

{ path:'admin/manage-shows', component: ManageShowsComponent },

{ path:'user/user-dashboard', component: UserDashboardComponent },

{ path:'booking/:movieId', component: BookingsComponent },

{ path:'payment', component: PaymentComponent },

{ path:'ticket', component: TicketComponent },

{ path:'profile', component: ProfileComponent },

{ path:'my-bookings', component: MyBookingsComponent }

];