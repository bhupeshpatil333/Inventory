import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { District } from '../features/components/district/district.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { getDoc, getDocs, onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  // districtSub$ = new BehaviorSubject<any[]>([]);
  // districtSubById$ = new BehaviorSubject<any | undefined>(null);

  constructor(private firestore: Firestore) { }

  private getCollection() {
    return collection(this.firestore, 'districts');
  }

  // getDistricts(): Observable<District[]> {
  //   return collectionData(this.getCollection(), { idField: 'id' }) as Observable<District[]>;
  // }
  // getDistrictById(id: string): Observable<District> {
  //   const districtDoc = doc(this.firestore, `districts/${id}`);
  //   return docData(districtDoc, { idField: 'id' }) as Observable<District>;
  // }

  // realtime data
  getDistrictDataRealtime(): Observable<any[]> {
    const colRef = collection(this.firestore, 'districts');
    return new Observable<any[]>(observer =>
      onSnapshot(colRef, snapshot =>
        observer.next(snapshot.docs.map(doc => ({ key: doc.id, ...doc.data() })))
      )
    );
  }

  // not realtime DB
  getDistrictData(): Promise<any[]> {
    return getDocs(this.getCollection()).then((res) => {
      const result = res.docs.map((doc) => ({
        key: doc.id,
        ...doc.data()
      }));
      return result;
    });
  }

  getDistrictById(id: string): Promise<any> {
    const ref = doc(this.firestore, `districts/${id}`);
    return getDoc(ref).then((docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        return data;
      } else {
        return null;
      }
    });
  }

  addDistrict(district: District) {
    return addDoc(this.getCollection(), district);
  }

  updateDistrict(id: string, district: District) {
    const docRef = doc(this.firestore, `districts/${id}`);
    return updateDoc(docRef, { ...district });
  }

  deleteDistrict(id: string) {
    const docRef = doc(this.firestore, `districts/${id}`);
    return deleteDoc(docRef);
  }

}
