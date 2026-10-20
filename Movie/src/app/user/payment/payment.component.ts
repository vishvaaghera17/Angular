import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  booking: any = {};
  isProcessing: boolean = false;
  card: any = { name: '', number: '', expiry: '', cvv: '' };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const data = localStorage.getItem('pendingBooking');
    if (!data) { this.router.navigate(['/']); return; }
    this.booking = JSON.parse(data);
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    this.card.number = value;
  }

  processPayment() {
    if (!this.card.name || !this.card.number || !this.card.expiry || !this.card.cvv) {
      alert("Please fill in all payment details");
      return;
    }
    if (this.card.number.replace(/\s/g, '').length < 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    this.isProcessing = true;

    // ✅ Parse seats — handle both array and comma string
    let seatsArray: string[] = [];
    if (Array.isArray(this.booking.seats)) {
      seatsArray = this.booking.seats;
    } else if (typeof this.booking.seats === 'string') {
      seatsArray = this.booking.seats.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }

    setTimeout(() => {
      const bookingPayload = {
        userName:    localStorage.getItem('userName') || 'Guest',
        userEmail:   localStorage.getItem('userEmail') || '',
        movieName:   this.booking.movieName,
        theaterName: this.booking.theaterName,
        showDate:    this.booking.showDate,    // ✅ save date
        showTime:    this.booking.showTime,
        seats:       seatsArray,               // ✅ save as array
        totalPrice:  this.booking.totalPrice
      };

      this.http.post("http://localhost:5000/api/booking/add", bookingPayload)
        .subscribe({
          next: () => {
            this.isProcessing = false;
            const confirmedBooking = {
              ...this.booking,
              userName:  bookingPayload.userName,
              userEmail: bookingPayload.userEmail,
              showDate:  bookingPayload.showDate,
              seats:     seatsArray
            };
            localStorage.setItem('confirmedBooking', JSON.stringify(confirmedBooking));
            localStorage.removeItem('pendingBooking');
            this.router.navigate(['/ticket']);
          },
          error: (err) => {
            console.log(err);
            this.isProcessing = false;
            alert("Booking failed. Please try again.");
          }
        });
    }, 2000);
  }
}