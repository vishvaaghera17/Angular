import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../../shared/admin-header/admin-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminHeaderComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  

}