import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-exit-dialog',
  imports: [MaterialModule],
  templateUrl: './confirm-exit-dialog.component.html',
  styleUrl: './confirm-exit-dialog.component.scss'
})
export class ConfirmExitDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmExitDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) { }
}
