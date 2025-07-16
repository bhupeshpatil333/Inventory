import { inject, Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { take, tap, map } from 'rxjs';
import { AuthService } from '../../../features/components/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class loginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private auth: Auth) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {

    return authState(this.auth).pipe(
      tap(user => {
        if (user) {
          this.router.navigate(['/dashboard']);
        }

      }),
      map(user => !user) // only allow access if NOT logged in
    );
  };
}




