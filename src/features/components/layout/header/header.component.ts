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
  isFormDirty: boolean = true; // ✅ manually set dirty state

  constructor(private location: Location,
    private titleStrategy: TitleStrategy, private router: Router, private dirtyCheck: DirtyCheckService) {
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

        // ✅ Calculate route depth from pathFromRoot
        const urlSegments = this.router.url.split('/').filter(Boolean);
        // Expecting pattern: ['dashboard', 'moduleName', ...]
        // Show back button if URL has more than 2 segments
        this.showBackButton = urlSegments.length > 2 && urlSegments[0] === 'dashboard';
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


  // goBack() {
  //   if (this.isFormDirty) {
  //     const confirmed = window.confirm('You have unsaved changes. Do you really want to go back?');
  //     if (confirmed) {
  //       this.dirtyCheck.isDirty = false; // reset dirty flag
  //       this.location.back(); // Navigate back
  //     }
  //     // else: stay on page
  //   } else {
  //     this.location.back();
  //   }
  // }

  // Confirm navigation away from unsaved changes
  goBack() {
    const initial = history.state.initialFormValue;
    const current = history.state.currentFormValue;

    if (initial && current && current !== initial) {
      const confirmLeave = confirm('You have unsaved changes. Do you want to go back?');
      if (!confirmLeave) return;
    }

    this.location.back();
  }



}
