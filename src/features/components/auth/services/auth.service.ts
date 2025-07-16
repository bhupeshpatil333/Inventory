import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, User, onAuthStateChanged } from '@angular/fire/auth';
import { list, push } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Database } from 'firebase/database';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
// import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // auth2 = inject(AngularFireAuth);
  currentUser$ = new BehaviorSubject<any | null>(null);
  constructor(private auth: Auth, private firestore: Firestore, private router: Router,) {
    // onAuthStateChanged(this.auth, (user) => {
    //   this.currentUser$.next(user);
    // });
  }

  // async register(email: string, password: string) {
  //   const credential = await this.auth2.createUserWithEmailAndPassword(email, password);
  //   const user = credential.user;

  //   if (user) {
  //     await this.db.list('users').push({
  //       uid: user.uid,
  //       email: user.email,
  //       createdAt: new Date(),
  //     });
  //   }
  //   return user;
  // }

  register(email: string, password: string) {
    // this.currentUser$.next(this.auth.currentUser);
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    // this.currentUser$.next(this.auth.currentUser);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return this.auth.signOut().then(() => this.router.navigate(['/login']));
  }

}
