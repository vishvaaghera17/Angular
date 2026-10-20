import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserHeaderComponent } from '../shared/user-header/user-header.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, UserHeaderComponent],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  movieId: string = '';
  movie: any = null;
  allShows: any[] = [];

  // Step 1 — Theater
  theaters: string[] = [];
  allTheaters: any[] = [];  // full theater objects with total_seats
  selectedTheater: string = '';
  selectedTheaterData: any = null;
  theaterScreens: { screen: number, shows: any[] }[] = [];

  // Step 2 — Show
  selectedShow: any = null;

  // Step 3 — Seats
  totalSeats: number = 40;
  bookedSeats: string[] = [];
  selectedSeats: string[] = [];
  seatGrid: { id: string, booked: boolean, selected: boolean }[][] = [];

  step: number = 1; // 1=theater, 2=show, 3=seats

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('movieId') || '';
    this.loadMovie();
  }

  loadMovie() {
    this.http.get<any[]>("http://localhost:5000/api/movies").subscribe({
      next: (movies) => {
        this.movie = movies.find(m => m.movieId == this.movieId);
        if (this.movie) this.loadShows();
      },
      error: (err) => console.log(err)
    });
  }

  loadShows() {
    this.http.get<any[]>("http://localhost:5000/api/shows").subscribe({
      next: (shows) => {
        this.allShows = shows.filter(
          s => s.movieName?.toLowerCase() === this.movie?.title?.toLowerCase()
        );
        const theaterSet = new Set<string>(this.allShows.map(s => s.theaterName));
        this.theaters = Array.from(theaterSet);
        // Load theater data for total_seats
        this.http.get<any[]>("http://localhost:5000/api/theater").subscribe({
          next: (theaters) => { this.allTheaters = theaters; },
          error: () => {}
        });
      },
      error: (err) => console.log(err)
    });
  }

  selectTheater(theater: string) {
    this.selectedTheater = theater;
    this.selectedTheaterData = this.allTheaters.find(t => t.name === theater) || null;
    this.selectedShow = null;
    this.selectedSeats = [];

    // Group by screen number
    const showsForTheater = this.allShows.filter(s => s.theaterName === theater);
    const screenMap = new Map<number, any[]>();
    showsForTheater.forEach(s => {
      const screen = s.screenNumber || 1;
      if (!screenMap.has(screen)) screenMap.set(screen, []);
      screenMap.get(screen)!.push(s);
    });

    this.theaterScreens = Array.from(screenMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([screen, shows]) => ({ screen, shows }));

    this.step = 2;
  }

  selectShow(show: any) {
    this.selectedShow = show;
    this.selectedSeats = [];
    this.loadBookedSeats(show._id);
    this.step = 3;
  }

  loadBookedSeats(showId: string) {
    this.http.get<any[]>("http://localhost:5000/api/booking").subscribe({
      next: (bookings) => {
        // ✅ Match by theater + date + time (no showId needed)
        const forThisShow = bookings.filter(b =>
          b.theaterName === this.selectedShow.theaterName &&
          b.showTime    === this.selectedShow.showTime &&
          b.showDate    === this.selectedShow.showDate
        );
        this.bookedSeats = forThisShow.flatMap(b =>
          Array.isArray(b.seats)
            ? b.seats
            : (b.seats ? b.seats.split(',').map((s: string) => s.trim()) : [])
        );
        this.buildSeatGrid();
      },
      error: () => {
        this.bookedSeats = [];
        this.buildSeatGrid();
      }
    });
  }

  buildSeatGrid() {
    const totalSeats = this.selectedTheaterData?.total_seats || 40;
    const cols = 10;  // seats per row
    const totalRows = Math.ceil(totalSeats / cols);
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, totalRows);

    this.seatGrid = rowLabels.map((row, rowIndex) => {
      const seatsInThisRow = (rowIndex === totalRows - 1 && totalSeats % cols !== 0)
        ? totalSeats % cols
        : cols;
      return Array.from({ length: seatsInThisRow }, (_, i) => {
        const id = `${row}${i + 1}`;
        return {
          id,
          booked: this.bookedSeats.includes(id),
          selected: false
        };
      });
    });
  }

  toggleSeat(seat: { id: string, booked: boolean, selected: boolean }) {
    if (seat.booked) return;
    seat.selected = !seat.selected;
    if (seat.selected) {
      this.selectedSeats.push(seat.id);
    } else {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat.id);
    }
  }

  get totalPrice(): number {
    return this.selectedSeats.length * (this.selectedShow?.ticketPrice || 150);
  }

  confirmBooking() {
    if (!localStorage.getItem('token')) {
      alert("Please login to book");
      this.router.navigate(['/login']);
      return;
    }
    if (this.selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    const bookingDetails = {
      movieName: this.movie.title,
      theaterName: this.selectedShow.theaterName,
      showDate: this.selectedShow.showDate,
      showTime: this.selectedShow.showTime,
      seats: this.selectedSeats.join(', '),
      totalPrice: this.totalPrice
    };

    localStorage.setItem('pendingBooking', JSON.stringify(bookingDetails));
    this.router.navigate(['/payment']);
  }

  goBack() {
    if (this.step === 3) { this.step = 2; this.selectedShow = null; this.selectedSeats = []; }
    else if (this.step === 2) { this.step = 1; this.selectedTheater = ''; this.theaterScreens = []; }
    else this.router.navigate(['/']);
  }
}