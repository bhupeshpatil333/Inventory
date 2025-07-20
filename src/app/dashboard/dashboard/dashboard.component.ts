import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/shared.module';
import { AuthService } from '../../../features/components/auth/services/auth.service';
import { UserCredential } from 'firebase/auth';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet, TitleStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/confirmDialog/confirmation-dialog/confirmation-dialog.component';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { HeaderComponent } from "../../../features/components/layout/header/header.component";
import { SidebarComponent } from "../../../features/components/layout/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard',
  imports: [MaterialModule, RouterOutlet, CommonModule, FormsModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  email: any;
  titlePage: any
  authService = inject(AuthService);
  router = inject(Router);

  title = 'Responsive Sidenav with Icons';

  isSmallScreen = false;

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private location: Location, private titleStrategy: TitleStrategy) {

  }

  ngOnInit(): void {
  }

  onSettings() {
    alert('Logout clicked!');
    // TODO: add logout logic here
  }


  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Logout',
        message: 'Are you sure you want to logout?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout(); // Only logout if user confirmed
      }
    });
  }


}
