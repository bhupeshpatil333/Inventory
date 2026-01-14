import { Injectable } from '@angular/core';
import { getDocs, addDoc, doc, updateDoc, deleteDoc, collection, Firestore } from '@angular/fire/firestore';
import { District } from '../district/district.interface';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private firestore: Firestore) { }

  private getCollection() {
    return collection(this.firestore, 'stockIn');
  }

  getStockData(): Promise<any[]> {
    return getDocs(this.getCollection()).then((res) => {
      const result = res.docs.map((doc) => ({
        key: doc.id,
        ...doc.data()
      }));
      return result;
    });
  }
  addStock(district: any) {
    return addDoc(this.getCollection(), district);
  }

  updateStock(id: string, district: any) {
    const docRef = doc(this.firestore, `stockIn/${id}`);
    return updateDoc(docRef, { ...district });
  }

  deleteStock(id: string) {
    const docRef = doc(this.firestore, `stockIn/${id}`);
    return deleteDoc(docRef);
  }
}
