import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
selector:'app-register',
standalone:true,
imports:[FormsModule,HttpClientModule, RouterLink, RouterLinkActive],
templateUrl:'./register.component.html',
styleUrls:['./register.component.css']
})

export class RegisterComponent{

user:any={
name:'',
email:'',
password:''
};

constructor(private http:HttpClient){}

register(){

this.http.post("http://localhost:5000/api/users/register",this.user)
.subscribe({

next:(res:any)=>{
alert("Registration Successful");
},

error:(err)=>{
alert("Registration Failed");
console.log(err);
}

});

}

}