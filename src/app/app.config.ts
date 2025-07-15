import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideDatabase, getDatabase } from '@angular/fire/database'; // firebase realtime DB
import { provideFirestore, getFirestore } from '@angular/fire/firestore';// For compatibility module fpr firestore
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from '../environment/environment';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()), // For compatibility module fpr firestore
    provideAuth(() => getAuth()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient()]
};
