import { inject, Injectable } from '@angular/core';
import { Auth, authState, onAuthStateChanged } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../features/components/auth/services/auth.service';
import { map, take, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private auth: Auth) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const pathName = route.routeConfig?.path;
    return authState(this.auth).pipe(
      take(1),
      map(user => {
        if (pathName === 'login') {
          if (user) {
            this.router.navigate(['/dashboard']);
            return false;
          } else {
            return true;
          }
        }

        if (pathName === 'dashboard') {
          if (!user) {
            console.log('user: ', user);
            this.router.navigate(['/login']);
            return false;
          } else {
            // console.log('user: ', user);
            return true;
          }
        }

        // baki sab routes ke liye allow kar do
        return true;
      })
    );
    // return true;
  }
}


