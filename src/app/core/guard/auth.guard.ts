import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../features/components/auth/services/auth.service';
import { take, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class authGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private auth: Auth
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const pathName = route.routeConfig?.path;
    return authState(this.auth).pipe(
      take(1),
      switchMap(async (user) => {
        if (pathName === 'login') {
          if (user) {
            this.router.navigate(['/dashboard']);
            return false;
          }
          return true;
        }

        if (pathName === 'dashboard') {
          if (!user) {
            this.router.navigate(['/login']);
            return false;
          }
          // ✅ Get claims
          const claims = await this.authService.getUserClaims();
          let role = claims?.['role'];
          console.log('Claims in guard:', claims);
          if (role === 'facility' || role === 'district') {
            return true; // allow access
          } else {
            await this.authService.logout();
            this.router.navigate(['/login']);
            return false;
          }
        }
        // Allow other routes
        return true;
      })
    );
  }
}
