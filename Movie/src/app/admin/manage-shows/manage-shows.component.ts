import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';

@Component({
  selector: 'app-manage-shows',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, AdminHeaderComponent],
  templateUrl: './manage-shows.component.html',
  styleUrls: ['./manage-shows.component.css']
})
export class ManageShowsComponent implements OnInit {

  show: any = { movieName: '', theaterName: '', screenNumber: '', showDate: '', showTime: '', ticketPrice: '' };
  shows: any[] = [];
  movies: any[] = [];
  theaters: any[] = [];

  availableScreens: number[] = [];
  editAvailableScreens: number[] = [];

  // ✅ Min dates for date pickers
  minShowDate: string = '';
  editMinShowDate: string = '';

  isEditing: boolean = false;
  editShowId: string = '';
  editShow: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getShows();
    this.getMovies();
    this.getTheaters();
  }

  getShows() {
    this.http.get<any[]>("http://localhost:5000/api/shows")
      .subscribe({ next: (res) => { this.shows = res; }, error: (err) => console.log(err) });
  }

  getMovies() {
    this.http.get<any[]>("http://localhost:5000/api/movies")
      .subscribe({ next: (res) => { this.movies = res; }, error: (err) => console.log(err) });
  }

  getTheaters() {
    this.http.get<any[]>("http://localhost:5000/api/theater")
      .subscribe({ next: (res) => { this.theaters = res; }, error: (err) => console.log(err) });
  }

  // ✅ Format any date to yyyy-MM-dd for input[type=date] min attribute
  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    return '';
  }

  // ✅ When movie selected in ADD form — set min date
  onMovieChange() {
    const selected = this.movies.find(m => m.title === this.show.movieName);
    if (selected && selected.releaseDate) {
      this.minShowDate = this.formatDateForInput(selected.releaseDate);
    } else {
      this.minShowDate = '';
    }
    // Reset date if it's before new min
    if (this.show.showDate && this.minShowDate && this.show.showDate < this.minShowDate) {
      this.show.showDate = '';
    }
  }

  // ✅ When movie selected in EDIT form — set min date
  onEditMovieChange() {
    const selected = this.movies.find(m => m.title === this.editShow.movieName);
    if (selected && selected.releaseDate) {
      this.editMinShowDate = this.formatDateForInput(selected.releaseDate);
    } else {
      this.editMinShowDate = '';
    }
    if (this.editShow.showDate && this.editMinShowDate && this.editShow.showDate < this.editMinShowDate) {
      this.editShow.showDate = '';
    }
  }

  // ✅ When theater selected in ADD form
  onTheaterChange() {
    const selected = this.theaters.find(t => t.name === this.show.theaterName);
    if (selected && selected.screens) {
      this.availableScreens = Array.from({ length: selected.screens }, (_, i) => i + 1);
    } else {
      this.availableScreens = [];
    }
    this.show.screenNumber = '';
  }

  // ✅ When theater selected in EDIT form
  onEditTheaterChange() {
    const selected = this.theaters.find(t => t.name === this.editShow.theaterName);
    if (selected && selected.screens) {
      this.editAvailableScreens = Array.from({ length: selected.screens }, (_, i) => i + 1);
    } else {
      this.editAvailableScreens = [];
    }
    this.editShow.screenNumber = '';
  }

  validate(s: any): string | null {
    if (!s.movieName) return 'Please select a Movie';
    if (!s.theaterName) return 'Please select a Theater';
    if (!s.screenNumber) return 'Please select a Screen';
    if (!s.showDate) return 'Show Date is required';
    if (!s.showTime) return 'Please select a Show Time';
    if (!s.ticketPrice || isNaN(s.ticketPrice)) return 'Ticket Price is required';
    return null;
  }

  addShow() {
    const error = this.validate(this.show);
    if (error) { alert(error); return; }

    this.http.post("http://localhost:5000/api/shows/add", this.show)
      .subscribe({
        next: () => {
          alert("Show Added Successfully");
          this.show = { movieName: '', theaterName: '', screenNumber: '', showDate: '', showTime: '', ticketPrice: '' };
          this.availableScreens = [];
          this.minShowDate = '';
          this.getShows();
        },
        error: (err) => { alert(err.error?.message || "Error adding show"); }
      });
  }

  openEdit(s: any) {
    this.isEditing = true;
    this.editShowId = s._id;
    this.editShow = { ...s };

    // Pre-load screens
    const selectedTheater = this.theaters.find(t => t.name === s.theaterName);
    if (selectedTheater && selectedTheater.screens) {
      this.editAvailableScreens = Array.from({ length: selectedTheater.screens }, (_, i) => i + 1);
    } else {
      this.editAvailableScreens = [];
    }

    // Pre-load min date from movie release date
    const selectedMovie = this.movies.find(m => m.title === s.movieName);
    if (selectedMovie && selectedMovie.releaseDate) {
      this.editMinShowDate = this.formatDateForInput(selectedMovie.releaseDate);
    } else {
      this.editMinShowDate = '';
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editShowId = '';
    this.editShow = {};
    this.editAvailableScreens = [];
    this.editMinShowDate = '';
  }

  saveEdit() {
    const error = this.validate(this.editShow);
    if (error) { alert(error); return; }

    this.http.put(`http://localhost:5000/api/shows/${this.editShowId}`, this.editShow)
      .subscribe({
        next: () => {
          alert("Show Updated Successfully");
          this.cancelEdit();
          this.getShows();
        },
        error: (err) => { alert(err.error?.message || "Error updating show"); }
      });
  }

  deleteShow(id: string) {
    if (!confirm("Delete this show?")) return;
    this.http.delete(`http://localhost:5000/api/shows/${id}`)
      .subscribe({
        next: () => { alert("Show deleted"); this.getShows(); },
        error: (err) => { console.log(err); alert("Error deleting show"); }
      });
  }
}