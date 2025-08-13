import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MaterialModule, CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClick(value: any) {
    this.dialogRef.close(value);
  }
}
