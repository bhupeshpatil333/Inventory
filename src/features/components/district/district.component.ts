import { Component, ViewEncapsulation } from '@angular/core';
import { District } from './district.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistrictService } from '../../../shared/district.service';
import { MaterialModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../../shared/confirmDialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommonTableComponent, ColumnConfig } from '../../../shared/common-table/common-table.component';

@Component({
  selector: 'app-district',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, FormsModule, CommonTableComponent],
  templateUrl: './district.component.html',
  styleUrl: './district.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DistrictComponent {

  columns: ColumnConfig[] = [
    { key: 'name', header: 'District', type: 'text' },
    { key: 'adminName', header: 'Admin Name', type: 'text' },
    { key: 'phone', header: 'Phone', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' },
    {
      key: 'actions',
      header: 'Actions',
      type: 'actions',
      actions: ['edit', 'delete']
    }
  ];
  dataSource: any[] = [];
  searchText: string = '';
  loading = false;



  constructor(private districtService: DistrictService, private fb: FormBuilder, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.districtService.getDistrictDataCached().subscribe((data) => {
      this.dataSource = data;
      this.loading = false;
      console.log('Realtime Data: ', this.dataSource);
    });

    // this.districtService.getDistrictData().then((data) => {
    //   if (data) {
    //     this.dataSource = data;
    //     this.loading = false;
    //     console.log('this.dataSource: ', this.dataSource);
    //   }
    // })

  }

  delete(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.districtService.deleteDistrict(id);
        console.log('District deleted');

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
