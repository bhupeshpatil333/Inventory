import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { District } from '../features/components/district/district.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  constructor(private firestore: Firestore) { }

  private getCollection() {
    return collection(this.firestore, 'districts');
  }

  getDistricts(): Observable<District[]> {
    return collectionData(this.getCollection(), { idField: 'id' }) as Observable<District[]>;
  }
  getDistrictById(id: string): Observable<District> {
    const districtDoc = doc(this.firestore, `districts/${id}`);
    return docData(districtDoc, { idField: 'id' }) as Observable<District>;
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
