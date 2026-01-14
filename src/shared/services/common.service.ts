// import { Injectable } from '@angular/core';
// import {
//   Firestore,
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   CollectionReference,
//   DocumentData,
//   serverTimestamp,
//   query,
//   orderBy,
//   where,
//   setDoc
// } from '@angular/fire/firestore';

// @Injectable({
//   providedIn: 'root'
// })
// export class CommonService {

//   constructor(private firestore: Firestore) { }

//   async createUserWithRole(uid: string, email: string, role: string) {
//     await setDoc(doc(this.firestore, "users", uid), {
//       email: email,
//       role: role,
//       createdAt: new Date()
//     });
//   }

//   // 🔗 Get collection reference
//   private getCollectionRef(collectionName: string): CollectionReference<DocumentData> {
//     return collection(this.firestore, collectionName);
//   }

//   // get year data
//   getYearData(collectionName: any, year: number) {
//     return getDocs(query(this.getCollectionRef(collectionName), where('year', '==', year))).then((res) => {
//       return res.docs.map((doc) => ({
//         key: doc.id,
//         ...doc.data()
//       })) as any[]; // <-- isse months property aa jayegi
//     });
//   }

//   // ✅ Common method for email check
//   async checkFieldExists(
//     collectionName: string,
//     fieldName: string,
//     value: string
//   ): Promise<boolean> {
//     const colRef = collection(this.firestore, collectionName);
//     const q = query(colRef, where(fieldName, '==', value));
//     const snapshot = await getDocs(q);
//     return !snapshot.empty; // true if exists
//   }


//   // 📦 Get all documents ordered by createdAt DESC
//   getAll(collectionName: string): Promise<any[]> {
//     const colRef = this.getCollectionRef(collectionName);
//     const orderedQuery = query(colRef, orderBy('createdAt', 'desc'));
//     return getDocs(orderedQuery).then((res) =>
//       res.docs.map((doc) => ({
//         key: doc.id,
//         ...doc.data()
//       }))
//     );
//   }

//   // 📄 Get document by ID
//   getById(collectionName: string, id: string): Promise<any | null> {
//     const docRef = doc(this.firestore, `${collectionName}/${id}`);
//     return getDoc(docRef).then((docSnap) => {
//       if (docSnap.exists()) {
//         return { key: docSnap.id, ...docSnap.data() };
//       } else {
//         return null;
//       }
//     });
//   }

//   // ➕ Add document with createdAt & updatedAt
//   add(collectionName: string, data: any): Promise<any> {
//     const payload = {
//       ...data,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     };
//     return addDoc(this.getCollectionRef(collectionName), payload);
//   }

//   // ✏️ Update document with updatedAt
//   update(collectionName: string, id: string, data: any): Promise<void> {
//     const docRef = doc(this.firestore, `${collectionName}/${id}`);
//     const payload = {
//       ...data,
//       updatedAt: serverTimestamp()
//     };
//     return updateDoc(docRef, payload);
//   }

//   // ❌ Delete document
//   delete(collectionName: string, id: string): Promise<void> {
//     const docRef = doc(this.firestore, `${collectionName}/${id}`);
//     return deleteDoc(docRef);
//   }
// }


import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  CollectionReference,
  DocumentData
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
  // Cache storage for multiple collections
  private collectionSubjects: { [key: string]: BehaviorSubject<any[]> } = {};

  constructor(private firestore: Firestore) { }

  async createUserWithRole(uid: string, email: string, role: string) {
    await setDoc(doc(this.firestore, "users", uid), {
      email,
      role,
      createdAt: new Date()
    });
  }

  // 🔗 Get collection reference
  private getCollectionRef(collectionName: string): CollectionReference<DocumentData> {
    return collection(this.firestore, collectionName);
  }

  // 📡 ✅ Realtime + Cached data for any collection
  listenCollection(collectionName: string, orderField: string = 'updatedAt'): Observable<any[]> {
    // If already created, return existing subject observable
    if (this.collectionSubjects[collectionName]) {
      return this.collectionSubjects[collectionName].asObservable();
    }

    // Otherwise, create BehaviorSubject
    this.collectionSubjects[collectionName] = new BehaviorSubject<any[]>([]);

    const q = query(this.getCollectionRef(collectionName), orderBy(orderField, 'desc'));

    onSnapshot(q, (res) => {
      const data = res.docs
        .map((doc) => ({
          key: doc.id,
          ...doc.data()
        }))
        .filter((item: any) => item.isDelete !== true); // 🚫 skip soft-deleted

      this.collectionSubjects[collectionName].next(data);
    });

    return this.collectionSubjects[collectionName].asObservable();
  }

  // get year data
  getYearData(collectionName: string, year: number) {
    return getDocs(query(this.getCollectionRef(collectionName), where('year', '==', year))).then((res) => {
      return res.docs.map((doc) => ({
        key: doc.id,
        ...doc.data()
      })) as any[];
    });
  }

  // ✅ Common method for email check
  async checkFieldExists(collectionName: string, fieldName: string, value: string): Promise<boolean> {
    const colRef = collection(this.firestore, collectionName);
    const q = query(colRef, where(fieldName, '==', value));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  // 📦 Get all documents ordered by createdAt DESC (one-time read, NOT realtime)
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
