import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserHeaderComponent } from '../../shared/user-header/user-header.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, UserHeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = { name: '', email: '', phone: '' };
  originalUser: any = {};
  isEditing: boolean = false;
  newPassword: string = '';
  totalBookings: number = 0;
  totalSpent: number = 0;
  userId: string = '';
  userEmail: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.loadUser();
    this.loadBookingStats();
  }

  loadUser() {
    this.http.get<any[]>("http://localhost:5000/api/users")
      .subscribe({
        next: (users) => {
          const found = users.find(u => u._id === this.userId);
          if (found) {
            this.user = { ...found };
            this.originalUser = { ...found };
          }
        },
        error: (err) => console.log(err)
      });
  }

  loadBookingStats() {
    this.http.get<any[]>("http://localhost:5000/api/booking")
      .subscribe({
        next: (bookings) => {
          const myBookings = bookings.filter(b => b.userEmail === this.userEmail);
          this.totalBookings = myBookings.length;
          this.totalSpent = myBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        },
        error: (err) => console.log(err)
      });
  }

  getInitial() {
    return this.user.name ? this.user.name.charAt(0).toUpperCase() : '?';
  }

  cancelEdit() {
    this.user = { ...this.originalUser };
    this.newPassword = '';
    this.isEditing = false;
  }

  saveProfile() {
    const updateData: any = {
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone
    };

    if (this.newPassword.trim()) {
      updateData.password = this.newPassword;
    }

    this.http.put(`http://localhost:5000/api/users/${this.userId}`, updateData)
      .subscribe({
        next: () => {
          localStorage.setItem('userName', this.user.name);
          localStorage.setItem('userEmail', this.user.email);
          this.originalUser = { ...this.user };
          this.newPassword = '';
          this.isEditing = false;
          alert("Profile updated successfully!");
        },
        error: (err) => {
          console.log(err);
          alert("Error updating profile");
        }
      });
  }
}