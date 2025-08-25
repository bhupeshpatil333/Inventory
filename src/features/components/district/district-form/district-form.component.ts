import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DistrictService } from '../../../../shared/district.service';
import { MaterialModule } from '../../../../shared/shared.module';
import { DirtyCheckService } from '../../../../shared/services/dirty-check.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ToastType } from '../../../../shared/toast-type.enum';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-district-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MaterialModule],
  templateUrl: './district-form.component.html',
  styleUrl: './district-form.component.scss'
})
export class DistrictFormComponent {

  districtData: any;
  districtId: string | null = null;

  form!: FormGroup;
  id: string | null = null;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private districtService: DistrictService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private dirtyCheck: DirtyCheckService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S+/)]],
      adminName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.id ? [] : [Validators.required, Validators.pattern(/\S+/)]], // changes
    });


    // Try getting full object from navigation state
    this.districtData = history.state.data;
    console.log('this.districtData: ', this.districtData);
    this.id = this.districtData?.key;

    if (this.districtData) {
      this.form.patchValue(this.districtData);
    }


    this.form.valueChanges.subscribe(() => {
      this.dirtyCheck.isDirty = this.form.dirty;
    });
  }

  async submit() {
    if (this.form.invalid) return;
    // when Add the district that time Password Feild is Show with proper validation and when edit the form that time password feild is hide but make sure when Edit that tiem DB only change the value without password feild, jabhi edit krunga tabh password ki feild delete nhi honi chaiye DB se this is important

    try {
      // 🔍 check email exist only for new district
      if (!this.id) {
        const exists = await this.commonService.checkFieldExists(
          'districts',   // Firestore collection
          'email',       // field to check
          this.form.value.email
        );

        if (exists) {
          this.form.get('email')?.setErrors({ emailExists: true });
          this.toast.show('Email already exists!', ToastType.Error);
          return;
        }
      }

      if (this.id) {
        // Remove password field for update operation
        const updateData = { ...this.form.value };
        delete updateData.password;
        //  // changes end

        await this.districtService.updateDistrict(this.id, updateData);
        this.toast.show('Updated Successfully.', ToastType.Success);
        this.router.navigate(['dashboard/district']);
      } else {
        await this.districtService.addDistrict(this.form.value);
        this.toast.show('Saved successfully!', ToastType.Success);
        this.router.navigate(['dashboard/district']);
      }
    } catch (error) {
      this.toast.show('Something went wrong!', ToastType.Error);
    }
  }


}
