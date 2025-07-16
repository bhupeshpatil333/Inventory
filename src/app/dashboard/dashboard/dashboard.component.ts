import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/shared.module';
import { AuthService } from '../../../features/components/auth/services/auth.service';
import { UserCredential } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  email: any;
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
  }
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((res) => {
      if (res.email) {
        this.email = res.email
      }
      console.log('email: ', res)
    })
  }

  goToLogin() {
    this.router.navigate(['/login'])
  }

  logout() {
    this.authService.logout();
  }
}
