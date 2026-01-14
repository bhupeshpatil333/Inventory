import { CommonService } from './../../../../shared/services/common.service';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DistrictService } from '../../../../shared/district.service';
import { FacilityService } from '../../facility/facility.service';
import { ItemService } from '../../items/service/item.service';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-allocation-history-add-edit',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './allocation-history-add-edit.component.html',
  styleUrl: './allocation-history-add-edit.component.scss'
})
export class AllocationHistoryAddEditComponent implements OnInit {
  districtCtrl = new FormControl('', [Validators.required]);
  facilityCtrl = new FormControl('', [Validators.required]);
  itemCtrl = new FormControl('', [Validators.required]);

  filteredDistricts!: Observable<{ key: string, name: string }[]>;
  filteredFacilities!: Observable<{ key: string, name: string }[]>;
  filteredItems!: Observable<{ key: string, name: string }[]>;

  allocationForm!: FormGroup;
  districts: any[] = [];
  facilities: any[] = [];
  items: any[] = [];
  isEdit = history.state.isEdit || false;
  selectedUnit: string = '';
  selectedAvailableStock: number = 0;
  initialFormValue: string = '';

  constructor(
    private fb: FormBuilder,
    private districtService: DistrictService,
    private facilityService: FacilityService,
    private itemService: ItemService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.allocationForm = this.fb.group({
      allocationType: ['district', Validators.required],
      district: [''],
      facility: [''],
      item: [''],
      allocateQuantity: ['', [Validators.required, Validators.min(1)]]
    });

    this.allocationForm.get('allocationType')?.valueChanges.subscribe(type => {
      this.updateValidationsBasedOnType(type);
    });

    this.updateValidationsBasedOnType('district');
  }

  async ngOnInit() {
    const myData = history.state.data;
    await this.loadDistricts();
    await this.loadFacilities();
    this.items = await this.itemService.getItemData();

    if (typeof myData !== 'undefined') {
      this.allocationForm.patchValue(myData);

      const selectedDistrict = this.districts.find(d => d.key === myData.district);
      this.districtCtrl.setValue(selectedDistrict);

      const selectedFacility = this.facilities.find(f => f.key === myData.facility);
      this.facilityCtrl.setValue(selectedFacility);

      const selectedItem = this.items.find(i => i.key === myData.item);
      this.itemCtrl.setValue(selectedItem);

      this.initialFormValue = JSON.stringify(this.allocationForm.getRawValue());
    }

    this.setupFilteredObservables();
    this.setupControlValueChanges();
  }

  private setupFilteredObservables() {
    this.filteredDistricts = this.districtCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (!value || value.length === 0) {
          return this.districts.slice();
        }
        return this._filterDistricts(value);
      })
    );

    this.filteredFacilities = this.facilityCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (!value || value.length === 0) {
          return this.facilities.slice();
        }
        return this._filterFacilities(value);
      })
    );

    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (!value || value.length === 0) {
          return this.items.slice();
        }
        return this._filterItems(value);
      })
    );
  }

  private setupControlValueChanges() {
    this.districtCtrl.valueChanges.subscribe(value => {
      if (this.allocationForm.get('allocationType')?.value === 'district') {
        const districtKey = value && typeof value === 'object' && (value as any).key ? (value as any).key : '';
        this.allocationForm.get('district')?.setValue(districtKey);
        this.districtCtrl.markAsTouched();
      }
    });

    this.facilityCtrl.valueChanges.subscribe(value => {
      if (this.allocationForm.get('allocationType')?.value === 'facility') {
        const facilityKey = value && typeof value === 'object' && (value as any).key ? (value as any).key : '';
        this.allocationForm.get('facility')?.setValue(facilityKey);
        this.facilityCtrl.markAsTouched();
      }
    });

    this.itemCtrl.valueChanges.subscribe(value => {
      const itemKey = value && typeof value === 'object' && (value as any).key ? (value as any).key : '';
      this.allocationForm.get('item')?.setValue(itemKey);
      this.itemCtrl.markAsTouched();
      this.updateSelectedItemDetails(itemKey);
    });
  }

  public _filterDistricts(value: any): { key: string, name: string }[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : ((value as any)?.name || '').toLowerCase();
    return this.districts.filter(d => d.name?.toLowerCase().includes(filterValue));
  }

  public _filterFacilities(value: any): { key: string, name: string }[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : ((value as any)?.name || '').toLowerCase();
    return this.facilities.filter(f => f.name?.toLowerCase().includes(filterValue));
  }

  public _filterItems(value: any): { key: string, name: string }[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : ((value as any)?.name || '').toLowerCase();
    return this.items.filter(i => i.name?.toLowerCase().includes(filterValue));
  }

  displayDistrictName(district: { key: string, name: string }): string {
    return district ? district.name : '';
  }

  displayFacilityName(facility: { key: string, name: string }): string {
    return facility ? facility.name : '';
  }

  displayItemName(item: { key: string, name: string }): string {
    return item ? item.name : '';
  }

  isFormChanged(): boolean {
    const currentValue = JSON.stringify(this.allocationForm.getRawValue());
    return currentValue !== this.initialFormValue;
  }

  updateSelectedItemDetails(itemKey: string) {
    const selectedItem = this.items.find(i => i.key === itemKey);
    this.selectedUnit = selectedItem?.unit || '';
    this.selectedAvailableStock = selectedItem?.containsPerUnit || 0;
  }

  async loadDistricts() {
    this.districts = await this.districtService.getDistrictData();
  }

  async loadFacilities() {
    this.facilities = await this.facilityService.getFacilitytData();
  }

  updateValidationsBasedOnType(allocationType: string) {
    const districtControl = this.allocationForm.get('district');
    const facilityControl = this.allocationForm.get('facility');

    if (allocationType === 'district') {
      districtControl?.setValidators([Validators.required]);
      facilityControl?.clearValidators();
      this.districtCtrl.setValidators([Validators.required]);
      this.facilityCtrl.clearValidators();
      this.facilityCtrl.reset();
      facilityControl?.reset();
    } else if (allocationType === 'facility') {
      facilityControl?.setValidators([Validators.required]);
      districtControl?.clearValidators();
      this.facilityCtrl.setValidators([Validators.required]);
      this.districtCtrl.clearValidators();
      this.districtCtrl.reset();
      districtControl?.reset();
    }

    this.itemCtrl.setValidators([Validators.required]);
    districtControl?.updateValueAndValidity();
    facilityControl?.updateValueAndValidity();
    this.districtCtrl.updateValueAndValidity();
    this.facilityCtrl.updateValueAndValidity();
    this.itemCtrl.updateValueAndValidity();
  }

  validateControl(fieldName: string, control: FormControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  validateFormControl(controlName: string): boolean {
    const control = this.allocationForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.allocationForm.get(controlName);
    return control ? control.hasError(errorType) : false;
  }

  hasControlError(control: FormControl, errorType: string): boolean {
    return control.hasError(errorType);
  }

  onSubmit() {
    this.allocationForm.markAllAsTouched();
    this.districtCtrl.markAsTouched();
    this.facilityCtrl.markAsTouched();
    this.itemCtrl.markAsTouched();

    const allocationType = this.allocationForm.get('allocationType')?.value;

    if (allocationType === 'district' && this.districtCtrl.invalid) {
      this.districtCtrl.setErrors({ 'required': true });
      return;
    }

    if (allocationType === 'facility' && this.facilityCtrl.invalid) {
      this.facilityCtrl.setErrors({ 'required': true });
      return;
    }

    if (this.itemCtrl.invalid) {
      this.itemCtrl.setErrors({ 'required': true });
      return;
    }

    if (this.allocationForm.valid && this.districtCtrl.valid && this.facilityCtrl.valid && this.itemCtrl.valid) {
      const formValue = { ...this.allocationForm.value };

      if (formValue.allocationType === 'district') {
        delete formValue.facility;
      } else if (formValue.allocationType === 'facility') {
        delete formValue.district;
      }

      if (this.isEdit) {
        this.commonService.update('allocationHist', history.state.data?.key, formValue);
      } else {
        this.commonService.add('allocationHist', formValue);
      }

      this.router.navigate(['dashboard/allocationHistory']);
    }
  }
}
