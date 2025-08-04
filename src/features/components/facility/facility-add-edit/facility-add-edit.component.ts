import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityService } from '../facility.service';
import { ToastType } from '../../../../shared/toast-type.enum';
import { ToastService } from '../../../../shared/services/toast.service';
import { DistrictService } from '../../../../shared/district.service';

@Component({
  selector: 'app-facility-add-edit',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './facility-add-edit.component.html',
  styleUrl: './facility-add-edit.component.scss'
})
export class FacilityAddEditComponent {
  facilityData!: any;
  districtData: any[] = [];
  isEdit: boolean = false;
  form!: FormGroup;
  facilityId: string | null = null;
  hide = true;
  states: string[] = ['Maharashtra', 'Gujarat', 'Rajasthan']; // or fetch from API
  facilityType = [
    // replace with ecg and x-ray type
    { key: 'ecg', name: 'ECG' },
    { key: 'x-ray', name: 'X-Ray' }
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private facilityService: FacilityService, private toast: ToastService, private districtService: DistrictService,
    private router: Router,) {
    this.form = this.fb.group({
      name: [''],
      districtId: [''],
      block: [''],
      type: [''],
      latitude: [''],
      longitude: [''],
      geoRadius: [''],
      employeeCode: [''],
      firstName: [''],
      lastName: [''],
      fatherHusbandName: [''],
      motherName: [''],
      dob: [''],
      doj: [''],
      nationality: [''],
      religion: [''],
      aadhaar: [''],
      address: [''],
      district: [''],
      email: [''],
      state: [''],
      pincode: [''],
      password: [''],
    });

    this.facilityData = history.state.data;
    console.log('this.facilityData: ', this.facilityData);
    // this.facilityId = this.facilityData?.key;
    this.isEdit = history.state.isEdit;


    this.districtService.getDistrictData().then((data) => {
      this.districtData = data;
    })


    if (this.facilityData) {
      this.form.patchValue(this.facilityData);
    }
  }

  submit() {
    if (this.isEdit) {
      this.facilityService.updateFacility(this.facilityData?.key, this.form.value);
      this.toast.show('Updated Successfully.', ToastType.Success);
      this.router.navigate(['dashboard/facility']);
    } else {
      this.facilityService.addFacility(this.form.value);
      this.toast.show('Saved successfully!', ToastType.Success);
      this.router.navigate(['dashboard/facility']);
    }
  }

  get combinedBlockType(): string {
    const block = this.form.get('block')?.value;
    const typeKey = this.form.get('type')?.value;
    const typeName = this.facilityType.find(t => t.key === typeKey)?.name || '';
    return block && typeName ? `${block} - ${typeName}` : '';
  }



}
