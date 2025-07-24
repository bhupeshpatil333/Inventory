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


  form!: FormGroup;
  facilityId: string | null = null;
  hide = true;
  states: string[] = ['Maharashtra', 'Gujarat', 'Rajasthan']; // or fetch from API

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private facilityService: FacilityService, private toast: ToastService, private districtService: DistrictService,
    private router: Router,) {
    this.form = this.fb.group({
      name: [''],
      district: [''],
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
      empDistrict: [''],
      state: [''],
      pincode: [''],
      password: [''],
    });

    this.facilityData = history.state.data;
    console.log('this.facilityData: ', this.facilityData);
    this.facilityId = this.facilityData?.key;

    if (this.facilityData) {
      this.form.patchValue(this.facilityData);
    }

    // this.route.paramMap.subscribe(params => {
    //   this.facilityId = params.get('id');
    //   if (this.facilityId) {
    //     this.facilityService.getFacilitytById(this.facilityId).then((data) => {
    //       if (data) {
    //         this.form.patchValue(data);
    //       }
    //     });
    //   }
    // });
  }

  submit() {
    if (this.facilityId) {
      this.facilityService.updateFacility(this.facilityId, this.form.value);
      this.toast.show('Updated Successfully.', ToastType.Success);
      this.router.navigate(['dashboard/facility']);
    } else {
      this.facilityService.addFacility(this.form.value);
      this.toast.show('Saved successfully!', ToastType.Success);
      this.router.navigate(['dashboard/facility']);
    }
  }

}
