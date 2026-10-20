import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: any = { email: '', password: '' };
  role: string = "user";

  constructor(private http: HttpClient, private router: Router) {}

  submit() {

    // ADMIN LOGIN
    if (this.role === "admin") {
      this.http.post("http://localhost:5000/api/admin/login", this.form)
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userName', res.admin?.name || 'Admin');
            localStorage.setItem('userEmail', res.admin?.email || '');
            localStorage.setItem('userId', res.admin?._id || '');
            localStorage.setItem('role', 'admin');
            alert("Admin Login Success");
            this.router.navigate(['/admin/dashboard']);
          },
          error: () => alert("Invalid Admin Login")
        });
    }

    // USER LOGIN
    else {
      this.http.post("http://localhost:5000/api/users/login", this.form)
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userName', res.user?.name || '');
            localStorage.setItem('userEmail', res.user?.email || ''); // ✅ save email
            localStorage.setItem('userId', res.user?._id || '');
            localStorage.setItem('role', 'user');
            alert("User Login Success");
            this.router.navigate(['/']);
          },
          error: () => alert("Invalid Email or Password")
        });
    }
  }
}