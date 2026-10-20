import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, AdminHeaderComponent, HttpClientModule],
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  admin: any = { username: '', email: '', password: '' };
  admins: any[] = [];

  isEditing: boolean = false;
  editAdminId: string = '';
  editAdmin: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit() { this.getAdmins(); }

  validate(a: any): string | null {
    if (!a.username?.trim()) return 'Admin Name is required';
    if (!a.email?.trim()) return 'Email is required';
    if (!a.password?.trim()) return 'Password is required';
    return null;
  }

  getAdmins() {
    this.http.get<any[]>("http://localhost:5000/api/admin")
      .subscribe({
        next: (res) => { this.admins = res; },
        error: (err) => console.log(err)
      });
  }

  addAdmin() {
    const error = this.validate(this.admin);
    if (error) { alert(error); return; }

    this.http.post("http://localhost:5000/api/admin/add", this.admin)
      .subscribe({
        next: () => {
          alert("Admin Added Successfully");
          this.admin = { username: '', email: '', password: '' };
          this.getAdmins();
        },
        error: (err) => { alert(err.error?.message || "Error adding admin"); }
      });
  }

  openEdit(a: any) {
    this.isEditing = true;
    this.editAdminId = a._id;
    this.editAdmin = { username: a.username, email: a.email, password: '' };
  }

  cancelEdit() {
    this.isEditing = false;
    this.editAdminId = '';
    this.editAdmin = {};
  }

  saveEdit() {
    if (!this.editAdmin.username?.trim()) { alert('Name is required'); return; }
    if (!this.editAdmin.email?.trim()) { alert('Email is required'); return; }

    const updateData: any = { username: this.editAdmin.username, email: this.editAdmin.email };
    if (this.editAdmin.password?.trim()) updateData.password = this.editAdmin.password;

    this.http.put(`http://localhost:5000/api/admin/${this.editAdminId}`, updateData)
      .subscribe({
        next: () => {
          alert("Admin Updated Successfully");
          this.cancelEdit();
          this.getAdmins();
        },
        error: (err) => { alert(err.error?.message || "Error updating admin"); }
      });
  }

  deleteAdmin(id: string) {
    if (!confirm("Delete this admin?")) return;
    this.http.delete(`http://localhost:5000/api/admin/${id}`)
      .subscribe({
        next: () => { alert("Admin deleted"); this.getAdmins(); },
        error: (err) => { console.log(err); alert("Error deleting admin"); }
      });
  }
}