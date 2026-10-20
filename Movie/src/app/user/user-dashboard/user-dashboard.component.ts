import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { UserHeaderComponent } from '../../shared/user-header/user-header.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [UserHeaderComponent, RouterLink, RouterModule, RouterLinkActive],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}