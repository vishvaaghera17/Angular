import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserHeaderComponent } from '../../shared/user-header/user-header.component';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  booking: any = {};
  bookingId: string = '';
  barcodeBars: number[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const data = localStorage.getItem('confirmedBooking');
    if (!data) {
      this.router.navigate(['/']);
      return;
    }

    this.booking = JSON.parse(data);

    // ✅ Fill email from localStorage if not in booking object
    if (!this.booking.userEmail) {
      this.booking.userEmail = localStorage.getItem('userEmail') || '';
    }

    this.bookingId = 'MV' + Date.now().toString().slice(-6);
    this.barcodeBars = Array.from({ length: 30 }, () =>
      Math.floor(Math.random() * 30) + 20
    );
  }

  printTicket() {
    window.print();
  }

  goHome() {
    localStorage.removeItem('confirmedBooking');
    this.router.navigate(['/']);
  }
}