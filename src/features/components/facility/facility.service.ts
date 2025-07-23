import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { District } from '../district/district.interface';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(private firestore: Firestore) { }

  private getCollection() {
    return collection(this.firestore, 'facility');
  }

  // getDistricts(): Observable<District[]> {
  //   return collectionData(this.getCollection(), { idField: 'id' }) as Observable<District[]>;
  // }
  // getDistrictById(id: string): Observable<District> {
  //   const districtDoc = doc(this.firestore, `districts/${id}`);
  //   return docData(districtDoc, { idField: 'id' }) as Observable<District>;
  // }

  // realtime data
  getFacilityDataRealtime(): Observable<any[]> {
    const colRef = collection(this.firestore, 'facility');
    return new Observable<any[]>(observer =>
      onSnapshot(colRef, snapshot =>
        observer.next(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() })))
      )
    );
  }

  // not realtime DB
  getFacilitytData(): Promise<any[]> {
    return getDocs(this.getCollection()).then((res) => {
      const result = res.docs.map((doc) => ({
        key: doc.id,
        ...doc.data()
      }));
      return result;
    });
  }

  getFacilitytById(id: string): Promise<any> {
    const ref = doc(this.firestore, `facility/${id}`);
    return getDoc(ref).then((docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        return data;
      } else {
        return null;
      }
    });
  }

  addFacility(district: District) {
    return addDoc(this.getCollection(), district);
  }

  updateFacility(id: string, district: District) {
    const docRef = doc(this.firestore, `facility/${id}`);
    return updateDoc(docRef, { ...district });
  }

  deleteFacility(id: string) {
    const docRef = doc(this.firestore, `facility/${id}`);
    return deleteDoc(docRef);
  }
}
