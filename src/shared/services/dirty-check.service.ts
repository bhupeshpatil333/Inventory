import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirtyCheckService {

  constructor() { }

  public isDirty = false;

  setDirtyState(state: boolean) {
    this.isDirty = state;
  }

  getDirtyState(): boolean {
    return this.isDirty;
  }

  reset() {
    this.isDirty = false;
  }
}
