import { Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData,
  getDocs, getDoc, addDoc, updateDoc, deleteDoc, onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private firestore: Firestore) { }

  private getCollection() {
    return collection(this.firestore, 'items');
  }

  // 🔁 Real-time updates
  getItemDataRealtime(): Observable<any[]> {
    const colRef = this.getCollection();
    return new Observable<any[]>(observer =>
      onSnapshot(colRef, snapshot =>
        observer.next(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      )
    );
  }

  // 📦 Get all items (one-time fetch)
  getItemData(): Promise<any[]> {
    return getDocs(this.getCollection()).then((res) => {
      return res.docs.map((doc) => ({
        key: doc.id,
        ...doc.data()
      }));
    });
  }

  // 📦 Get single item by ID
  getItemById(id: string): Promise<any> {
    const ref = doc(this.firestore, `items/${id}`);
    return getDoc(ref).then((docSnap) => {
      if (docSnap.exists()) {
        return { key: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    });
  }

  // ➕ Add new item
  addItem(item: any) {
    return addDoc(this.getCollection(), item);
  }

  // ✏️ Update existing item
  updateItem(id: string, item: any) {
    const docRef = doc(this.firestore, `items/${id}`);
    return updateDoc(docRef, { ...item });
  }

  // ❌ Delete item
  deleteItem(id: string) {
    const docRef = doc(this.firestore, `items/${id}`);
    return deleteDoc(docRef);
  }
}
