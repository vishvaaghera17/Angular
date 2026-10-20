import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [FormsModule, HttpClientModule, AdminHeaderComponent, CommonModule],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

  movie: any = {
    movieId: '', title: '', description: '',
    duration: '', genre: '', language: '',
    releaseDate: '', status: ''
  };
  selectedFile: any;
  movies: any[] = [];

  isEditing: boolean = false;
  editMovieId: string = '';
  editMovie: any = {};
  editFile: any;

  constructor(private http: HttpClient) {}

  ngOnInit() { this.fetchMovies(); }

  fetchMovies() {
    this.http.get<any[]>("http://localhost:5000/api/movies")
      .subscribe({
        next: (res) => { this.movies = res; },
        error: (err) => { console.log(err); }
      });
  }

  onFileSelect(event: any) { this.selectedFile = event.target.files[0]; }
  onEditFileSelect(event: any) { this.editFile = event.target.files[0]; }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split('-');
      return `${y}-${m}-${d}`;
    }
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
    return dateStr;
  }

  // ✅ Validate all fields
  validateMovie(m: any): string | null {
    if (!m.movieId || String(m.movieId).trim() === '') return 'Movie ID is required';
    if (!m.title || m.title.trim() === '') return 'Movie Title is required';
    if (!m.description || m.description.trim() === '') return 'Description is required';
    if (!m.duration || m.duration.trim() === '') return 'Duration is required';
    if (!m.genre || m.genre === '') return 'Please select a Genre';
    if (!m.language || m.language === '') return 'Please select a Language';
    if (!m.releaseDate || m.releaseDate === '') return 'Release Date is required';
    if (!m.status || m.status === '') return 'Please select a Status';
    return null;
  }

  addMovie() {
    const error = this.validateMovie(this.movie);
    if (error) { alert(error); return; }

    const formData = new FormData();
    Object.keys(this.movie).forEach(key => formData.append(key, this.movie[key]));
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.http.post("http://localhost:5000/api/movies/add", formData)
      .subscribe({
        next: () => {
          alert("Movie Added Successfully");
          this.movie = { movieId: '', title: '', description: '', duration: '', genre: '', language: '', releaseDate: '', status: '' };
          this.selectedFile = null;
          this.fetchMovies();
        },
        error: (err) => { console.log(err); alert("Error adding movie"); }
      });
  }

  openEdit(m: any) {
    this.isEditing = true;
    this.editMovieId = m._id;
    this.editMovie = {
      title: m.title || '',
      description: m.description || '',
      duration: m.duration || '',
      genre: m.genre || '',
      language: m.language || '',
      releaseDate: this.formatDateForInput(m.releaseDate),
      status: m.status || ''
    };
    this.editFile = null;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editMovieId = '';
    this.editMovie = {};
    this.editFile = null;
  }

  saveEdit() {
    // ✅ Validate edit fields (movieId not needed for edit)
    if (!this.editMovie.title?.trim()) { alert('Title is required'); return; }
    if (!this.editMovie.description?.trim()) { alert('Description is required'); return; }
    if (!this.editMovie.duration?.trim()) { alert('Duration is required'); return; }
    if (!this.editMovie.genre) { alert('Please select a Genre'); return; }
    if (!this.editMovie.language) { alert('Please select a Language'); return; }
    if (!this.editMovie.releaseDate) { alert('Release Date is required'); return; }
    if (!this.editMovie.status) { alert('Please select a Status'); return; }

    const formData = new FormData();
    ['title', 'description', 'duration', 'genre', 'language', 'releaseDate', 'status']
      .forEach(key => formData.append(key, this.editMovie[key] || ''));
    if (this.editFile) formData.append('image', this.editFile);

    this.http.put(`http://localhost:5000/api/movies/${this.editMovieId}`, formData)
      .subscribe({
        next: () => {
          alert("Movie Updated Successfully");
          this.cancelEdit();
          this.fetchMovies();
        },
        error: (err) => { console.log(err); alert("Error updating movie: " + (err.error?.message || '')); }
      });
  }

  deleteMovie(id: string) {
    if (!id) { alert("Invalid movie ID"); return; }
    if (!confirm("Are you sure you want to delete this movie?")) return;
    this.http.delete(`http://localhost:5000/api/movies/${id}`)
      .subscribe({
        next: () => { alert("Movie deleted successfully"); this.fetchMovies(); },
        error: (err) => { console.log(err); alert("Error deleting movie"); }
      });
  }
}