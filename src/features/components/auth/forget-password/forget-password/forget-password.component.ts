import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  resetForm: FormGroup;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    this.message = '';
    this.error = '';

    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;

      try {
        await this.authService.resetPassword(email);
        this.message = 'Reset email sent. Check your inbox.';
      } catch (err: any) {
        this.error = err.message;
        console.log('this.error: ', this.error);
      }
    }
  }

}
