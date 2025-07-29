import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AllocationHistoryService {

  constructor(private firestore: Firestore) { }

  private getCollection() {
    return collection(this.firestore, 'allocationHist');
  }

  getData(): Promise<any[]> {
    return getDocs(this.getCollection()).then((res) => {
      return res.docs.map((doc) => ({
        key: doc.id,
        ...doc.data()
      }));
    });
  }
}
