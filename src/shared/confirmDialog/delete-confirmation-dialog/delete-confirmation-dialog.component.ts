import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../shared.module';

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [MaterialModule],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss'
})
export class DeleteConfirmationDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) { }

  confirm() {
    this.dialogRef.close(true);
  }
}
