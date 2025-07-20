import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/confirmDialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule, RouterLink,
    CommonModule, RouterModule,
    FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private dialog: MatDialog, private authService: AuthService) { }


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
