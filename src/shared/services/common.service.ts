import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentData,
  serverTimestamp,
  query,
  orderBy
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private firestore: Firestore) { }

  // 🔗 Get collection reference
  private getCollectionRef(collectionName: string): CollectionReference<DocumentData> {
    return collection(this.firestore, collectionName);
  }

  // 📦 Get all documents ordered by createdAt DESC
  getAll(collectionName: string): Promise<any[]> {
    const colRef = this.getCollectionRef(collectionName);
    const orderedQuery = query(colRef, orderBy('createdAt', 'desc'));
    return getDocs(orderedQuery).then((res) =>
      res.docs.map((doc) => ({
        key: doc.id,
        ...doc.data()
      }))
    );
  }

  // 📄 Get document by ID
  getById(collectionName: string, id: string): Promise<any | null> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        return { key: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    });
  }

  // ➕ Add document with createdAt & updatedAt
  add(collectionName: string, data: any): Promise<any> {
    const payload = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    return addDoc(this.getCollectionRef(collectionName), payload);
  }

  // ✏️ Update document with updatedAt
  update(collectionName: string, id: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    const payload = {
      ...data,
      updatedAt: serverTimestamp()
    };
    return updateDoc(docRef, payload);
  }

  // ❌ Delete document
  delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${id}`);
    return deleteDoc(docRef);
  }
}
