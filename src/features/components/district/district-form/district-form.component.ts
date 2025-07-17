import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DistrictService } from '../../../../shared/district.service';
import { MaterialModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-district-form',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MaterialModule],
  templateUrl: './district-form.component.html',
  styleUrl: './district-form.component.scss'
})
export class DistrictFormComponent {

  form!: FormGroup;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private districtService: DistrictService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      district: ['', Validators.required],
      adminName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.districtService.getDistrictById(this.id).subscribe(data => this.form.patchValue(data));
    }
  }

  submit() {
    if (this.form.invalid) return;

    if (this.id) {
      this.districtService.updateDistrict(this.id, this.form.value).then(() => this.router.navigate(['dashboard/district']));
    } else {
      this.districtService.addDistrict(this.form.value).then(() => this.router.navigate(['dashboard/district']));
    }
  }

}
