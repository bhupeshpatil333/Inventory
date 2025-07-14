import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from '@angular/fire/auth';
import { list, push } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Database } from 'firebase/database';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth2 = inject(AngularFireAuth);
  constructor(private auth: Auth, private db: AngularFireDatabase, private router: Router,) { }

  async register(email: string, password: string) {
    const credential = await this.auth2.createUserWithEmailAndPassword(email, password);
    const user = credential.user;

    if (user) {
      await this.db.list('users').push({
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
      });
    }
    return user;
  }

  async login(email: string, password: string) {
    const credential = await this.auth2.signInWithEmailAndPassword(email, password);
    return credential.user;
  }

  logout() {
    return this.auth2.signOut().then(() => this.router.navigate(['/login']));
  }

}
