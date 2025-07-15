import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/components/auth/services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    map(user => {
      if (user) {
        console.log('User is authenticated');
        return true;
      } else {
        console.log('User is NOT authenticated — redirecting');
        router.navigate(['/login']);
        return false;
      }
    })
  )

  // if (auth.currentUser) {
  //   // User is authenticated, allow access

  //   console.log('User is authenticated');
  //   return true;
  // }
  // else {
  //   router.navigate(['/login']);
  //   return false;
  // }

};
