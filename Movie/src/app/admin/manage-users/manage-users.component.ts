import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';

@Component({
selector:'app-manage-users',
standalone:true,
imports:[CommonModule, FormsModule, HttpClientModule, AdminHeaderComponent],
templateUrl:'./manage-users.component.html',
styleUrls:['./manage-users.component.css']
})

export class ManageUsersComponent implements OnInit{

users:any=[];

constructor(private http:HttpClient){}

ngOnInit(){

this.getUsers();

}

getUsers(){

this.http.get("http://localhost:5000/api/users")
.subscribe((res:any)=>{

this.users = res;

});

}

deleteUser(id:any){

if(confirm("Delete this user?")){

this.http.delete("http://localhost:5000/api/users/"+id)
.subscribe(()=>{

alert("User deleted");

this.getUsers();

});

}

}

}