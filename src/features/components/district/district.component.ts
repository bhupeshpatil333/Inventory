import { Component } from '@angular/core';
import { District } from './district.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistrictService } from '../../../shared/district.service';
import { MaterialModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../../shared/confirmDialog/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-district',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './district.component.html',
  styleUrl: './district.component.scss'
})
export class DistrictComponent {

  displayedColumns = ['district', 'adminName', 'phone', 'email', 'actions'];
  dataSource: District[] = [];
  searchText: string = '';
  loading = false;

  constructor(private districtService: DistrictService, private fb: FormBuilder, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    // this.districtService.getDistricts().subscribe((data) => {
    //   this.dataSource = data;
    // });
    this.loading = true;
    this.districtService.districtSub$.subscribe(data => {
      console.log('data: ', data);
      if (data === null) {
        this.loading = true; // Still loading
      } else {
        this.dataSource = data;
        this.loading = false;
      }

    })
    this.loading = true;
    this.districtService.getDistrictData().then((data) => {
      if (data) {
        this.loading = false;
      }
    })
  }

  delete(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.districtService.deleteDistrict(id).then(() => {
          console.log('District deleted');
        });
      }
    });
  }

  edit(id: string) {
    console.log('id: ', id);
    this.router.navigate(['/dashboard/district/edit', id]);
  }

  add() {
    this.router.navigate(['/dashboard/district/add']);
  }

  get filteredData() {
    const search = this.searchText.toLowerCase();
    return this.dataSource.filter(d =>
      (d?.district || '').toLowerCase().includes(search) ||
      (d?.adminName || '').toLowerCase().includes(search)
    );
  }
}
