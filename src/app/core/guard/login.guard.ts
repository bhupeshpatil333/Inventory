import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { take, tap, map } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    tap(user => {
      if (user) {
        router.navigate(['/dashboard']);
      }

    }),
    map(user => !user) // only allow access if NOT logged in
  );
};
