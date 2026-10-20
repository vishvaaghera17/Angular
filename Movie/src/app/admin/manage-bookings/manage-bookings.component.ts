import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';
import { FormsModule } from '@angular/forms';

@Component({
selector:'app-manage-bookings',
standalone:true,
imports:[CommonModule, AdminHeaderComponent, FormsModule, HttpClientModule],
templateUrl:'./manage-bookings.component.html',
styleUrls:['./manage-bookings.component.css']
})

export class ManageBookingsComponent implements OnInit{

bookings:any=[];

constructor(private http:HttpClient){}

ngOnInit(){

this.getBookings();

}

getBookings(){

this.http.get("http://localhost:5000/api/booking")
.subscribe((res:any)=>{

this.bookings = res;

});

}

deleteBooking(id:any){

if(confirm("Delete this booking?")){

this.http.delete("http://localhost:5000/api/booking/"+id)
.subscribe(()=>{

alert("Booking deleted");

this.getBookings();

});

}

}

}