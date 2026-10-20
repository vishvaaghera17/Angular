import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-theater',
  standalone: true,
  imports: [FormsModule, HttpClientModule, AdminHeaderComponent, CommonModule],
  templateUrl: './add-theater.component.html',
  styleUrls: ['./add-theater.component.css']
})
export class AddTheaterComponent implements OnInit {

  theater: any = { name: '', address: '', city: '', total_seats: '', screens: '', contact_number: '' };
  theaters: any[] = [];

  isEditing: boolean = false;
  editTheaterId: string = '';
  editTheater: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() { this.fetchTheaters(); }

  fetchTheaters() {
    this.http.get<any[]>("http://localhost:5000/api/theater")
      .subscribe({
        next: (res) => { this.theaters = res; },
        error: (err) => { console.log(err); }
      });
  }

  validate(t: any): string | null {
    if (!t.name?.trim()) return 'Theater Name is required';
    if (!t.address?.trim()) return 'Address is required';
    if (!t.city?.trim()) return 'City is required';
    if (!t.total_seats || isNaN(t.total_seats)) return 'Total Seats is required';
    if (!t.screens || isNaN(t.screens)) return 'Number of Screens is required';
    if (!t.contact_number?.trim()) return 'Contact Number is required';
    return null;
  }

  addTheater() {
    const error = this.validate(this.theater);
    if (error) { alert(error); return; }

    this.http.post("http://localhost:5000/api/theater/add", this.theater)
      .subscribe({
        next: () => {
          alert("Theater Added Successfully");
          this.theater = { name: '', address: '', city: '', total_seats: '', screens: '', contact_number: '' };
          this.fetchTheaters();
        },
        error: (err) => { alert(err.error?.message || "Error adding theater"); }
      });
  }

  openEdit(t: any) {
    this.isEditing = true;
    this.editTheaterId = t._id;
    this.editTheater = { ...t };
  }

  cancelEdit() {
    this.isEditing = false;
    this.editTheaterId = '';
    this.editTheater = {};
  }

  saveEdit() {
    const error = this.validate(this.editTheater);
    if (error) { alert(error); return; }

    this.http.put(`http://localhost:5000/api/theater/${this.editTheaterId}`, this.editTheater)
      .subscribe({
        next: () => {
          alert("Theater Updated Successfully");
          this.cancelEdit();
          this.fetchTheaters();
        },
        error: (err) => { alert(err.error?.message || "Error updating theater"); }
      });
  }

  deleteTheater(id: string) {
    if (!confirm("Are you sure you want to delete this theater?")) return;
    this.http.delete(`http://localhost:5000/api/theater/${id}`)
      .subscribe({
        next: () => { alert("Theater deleted successfully"); this.fetchTheaters(); },
        error: (err) => { console.log(err); alert("Error deleting theater"); }
      });
  }
}