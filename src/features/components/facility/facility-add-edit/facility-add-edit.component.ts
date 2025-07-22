import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facility-add-edit',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './facility-add-edit.component.html',
  styleUrl: './facility-add-edit.component.scss'
})
export class FacilityAddEditComponent {

  form: FormGroup;
  facilityId: string | null = null;
  hide = true;
  states: string[] = ['Maharashtra', 'Gujarat', 'Rajasthan']; // or fetch from API

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.form = this.fb.group({
      facilityName: [''],
      facilityDistrict: [''],
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

    this.route.paramMap.subscribe(params => {
      this.facilityId = params.get('id');
      if (this.facilityId) {
        // this.patchForm(this.facilityId);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    if (this.facilityId) {
      console.log('Update:', this.form.value);
    } else {
      console.log('Create:', this.form.value);
    }
  }

}
