import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { TitleStrategy, NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { DirtyCheckService } from '../../../../shared/services/dirty-check.service';
import { ConfirmExitDialogComponent } from '../../../../shared/confirm-exit-dialog/confirm-exit-dialog.component';

@Component({
  selector: 'app-header',
  imports: [MaterialModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  titlePage: any;
  showBackButton = false; // 👈 flag for back button

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private location: Location,
    private titleStrategy: TitleStrategy, private router: Router, private route: ActivatedRoute, private dirtyCheck: DirtyCheckService) {
    // changing routing names 
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const snapshot = this.router.routerState.snapshot;
        const title = this.titleStrategy.buildTitle(snapshot);
        if (title) {
          document.title = title;
          this.titlePage = title;
        }

        // ✅ Dynamic logic based on URL depth
        this.setTitleAndBackButton(this.route);
      });
  }

  setTitleAndBackButton(route: ActivatedRoute) {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }

    const snapshot = current.snapshot;
    this.showBackButton = snapshot.data['showBackButton'] || false;
  }


  goBack() {
    if (this.dirtyCheck.isDirty) {
      const dialogRef = this.dialog.open(ConfirmExitDialogComponent);

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.dirtyCheck.isDirty = false; // reset
          this.location.back(); // Navigate back
        }
        // else do nothing (stay on page)
      });
    } else {
      this.location.back();
    }
  }
}
