import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { TitleStrategy, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  titlePage: any;

  constructor(private breakpointObserver: BreakpointObserver, private dialog: MatDialog, private location: Location, private titleStrategy: TitleStrategy, private router: Router) {
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
      });
  }

  goBack() {
    this.location.back(); // ⬅️ goes to the previous route
  }
}
