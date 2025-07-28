import { updateDoc } from '@angular/fire/firestore';
import { CommonService } from './../../../../shared/services/common.service';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DistrictService } from '../../../../shared/district.service';
import { FacilityService } from '../../facility/facility.service';
import { ItemService } from '../../items/service/item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allocation-history-add-edit',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './allocation-history-add-edit.component.html',
  styleUrl: './allocation-history-add-edit.component.scss'
})
export class AllocationHistoryAddEditComponent implements OnInit {
  allocationForm!: FormGroup;
  districts: any[] = [];
  facilities: any[] = [];
  items: any[] = [];
  isEdit = history.state.isEdit || false;

  constructor(
    private fb: FormBuilder,
    private districtService: DistrictService,
    private facilityService: FacilityService,
    private itemService: ItemService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.allocationForm = this.fb.group({
      allocationType: ['district', Validators.required], // default to district
      district: [''],
      facility: [''],
      item: ['', Validators.required],
      availableStock: [''],
      allocateQuantity: ['', [Validators.required, Validators.min(1)]]
    });

  }

  async ngOnInit() {
    const myData = history.state.data;
    if (typeof (myData) !== 'undefined') {
      this.allocationForm.patchValue(myData);
    }

    await this.loadDistricts();
    await this.loadFacilities();

    this.items = await this.itemService.getItemData();
  }

  async loadDistricts() {
    this.districts = await this.districtService.getDistrictData();
  }

  async loadFacilities() {
    this.facilities = await this.facilityService.getFacilitytData();
  }

  onSubmit() {
    if (this.allocationForm.valid) {
      console.log(this.allocationForm.value);

      if (this.isEdit) {
        this.commonService.update('allocationHist', history.state.data?.key, this.allocationForm.value);
        this.router.navigate(['dashboard/allocationHistory']);
      } else {
        this.commonService.add('allocationHist', this.allocationForm.value);
        this.router.navigate(['dashboard/allocationHistory']);
      }

    }
  }
}
