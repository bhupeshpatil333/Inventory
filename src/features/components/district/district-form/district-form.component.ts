import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DistrictService } from '../../../../shared/district.service';
import { MaterialModule } from '../../../../shared/shared.module';
import { DirtyCheckService } from '../../../../shared/services/dirty-check.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ToastType } from '../../../../shared/toast-type.enum';

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
    private router: Router,
    private route: ActivatedRoute,
    private dirtyCheck: DirtyCheckService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      district: ['', [Validators.required, Validators.pattern(/\S+/)]],
      adminName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/\S+/)]],
    });

    // Get ID from route param
    // this.districtId = this.route.snapshot.paramMap.get('id');

    // Try getting full object from navigation state
    this.districtData = history.state.data;
    console.log('this.districtData: ', this.districtData);
    this.id = this.districtData?.key;

    if (this.districtData) {
      this.form.patchValue(this.districtData);
    }

    // this.id = this.route.snapshot.paramMap.get('id');
    // // if (this.id) {
    // //   this.districtService.getDistrictById(this.id).subscribe(data => this.form.patchValue(data));
    // // }
    // if (this.id) {
    //   // Load once via Promise
    //   // this.districtService.getDistrictById(this.id);
    //   // Subscribe to BehaviorSubject updates
    //   this.districtService.getDistrictById(this.id).then((data) => {
    //     if (data) {
    //       this.form.patchValue(data);
    //       this.loading = false;
    //     }
    //     else {
    //       this.loading = false;
    //     }
    //   });

    // }

    this.form.valueChanges.subscribe(() => {
      this.dirtyCheck.isDirty = this.form.dirty;
    });
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      if (this.id) {
        await this.districtService.updateDistrict(this.id, this.form.value);
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
