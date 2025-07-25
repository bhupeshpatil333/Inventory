import { Component, ViewEncapsulation } from '@angular/core';
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
  styleUrl: './district.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DistrictComponent {

  displayedColumns = ['district', 'adminName', 'phone', 'email', 'actions'];
  dataSource: any[] = [];
  searchText: string = '';
  loading = false;

  constructor(private districtService: DistrictService, private fb: FormBuilder, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loading = true;
    // this.districtService.getDistrictData().then((data) => {
    //   if (data) {
    //     this.dataSource = data;
    //     this.loading = false;
    //   }
    // })
    this.districtService.getDistrictData().then((data) => {
      if (data) {
        this.dataSource = data;
        this.loading = false;
      }
    })

  }

  delete(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.districtService.deleteDistrict(id);
        console.log('District deleted');

        // ✅ Refresh the list and update UI
        this.dataSource = await this.districtService.getDistrictData();
      }
    });
  }


  edit(data: any) {
    this.router.navigate(['/dashboard/district/edit', data.key], { state: { data: data } });
  }

  add() {
    this.router.navigate(['/dashboard/district/add']);
  }

  get filteredData() {
    const search = this.searchText.toLowerCase();
    return this.dataSource.filter(d =>
      (d?.name || '').toLowerCase().includes(search) ||
      (d?.adminName || '').toLowerCase().includes(search)
    );
  }
}
