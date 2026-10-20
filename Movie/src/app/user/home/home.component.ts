import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  movies: any[] = [];
  isLoggedIn: boolean = false;

  // Carousel
  currentSlide: number = 0;
  autoplayInterval: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.loadMovies();
  }

  loadMovies() {
    this.http.get<any[]>("http://localhost:5000/api/movies").subscribe({
      next: (data) => {
        this.movies = data;
        this.startAutoplay();
      },
      error: (err) => console.log(err)
    });
  }

  // ── Carousel ──
  get carouselMovies(): any[] {
    return this.movies.slice(0, 5); // show first 5 in carousel
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0
      ? this.carouselMovies.length - 1
      : this.currentSlide - 1;
    this.resetAutoplay();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselMovies.length;
    this.resetAutoplay();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.resetAutoplay();
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      if (this.carouselMovies.length > 0) {
        this.currentSlide = (this.currentSlide + 1) % this.carouselMovies.length;
      }
    }, 4000);
  }

  resetAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }

  ngOnDestroy() {
    clearInterval(this.autoplayInterval);
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

  bookNow(movie: any) {
    if (!this.isLoggedIn) {
      alert("Please login to book a ticket");
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/booking', movie.movieId]);
  }
}