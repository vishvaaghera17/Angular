import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserHeaderComponent } from '../../shared/user-header/user-header.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, UserHeaderComponent],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {

  bookings: any[] = [];
  userEmail: string = '';
  cancellingId: string = '';  // tracks which booking is being cancelled

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.fetchBookings();
  }

  fetchBookings() {
    this.http.get<any[]>(`http://localhost:5000/api/booking`)
      .subscribe({
        next: (res) => {
          this.bookings = res
            .filter(b => b.userEmail === this.userEmail)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        error: (err) => console.log(err)
      });
  }

  cancelBooking(id: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    this.cancellingId = id;
    this.http.delete(`http://localhost:5000/api/booking/${id}`)
      .subscribe({
        next: () => {
          this.cancellingId = '';
          this.bookings = this.bookings.filter(b => b._id !== id);
        },
        error: (err) => {
          console.log(err);
          this.cancellingId = '';
          alert("Failed to cancel booking. Please try again.");
        }
      });
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  getSeatList(seats: any): string[] {
    if (!seats) return [];
    if (Array.isArray(seats)) return seats;
    return seats.split(",").map((s: string) => s.trim()).filter((s: string) => s);
  }
}