import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  api = "http://localhost:5000";

  constructor(private http: HttpClient){}

  login(data:any){
    return this.http.post(`${this.api}/users/login`, data);
  }

  register(data:any){
    return this.http.post(`${this.api}/users/register`, data);
  }

  saveToken(token:string){ localStorage.setItem("token", token); }
  getToken(){ return localStorage.getItem("token"); }

  saveRole(role:string){ localStorage.setItem("role", role); }
  getRole(){ return localStorage.getItem("role"); }

  logout(){
    localStorage.clear();
  }

  isLoggedIn(){
    return !!this.getToken();
  }
}
