import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { Database, ref, push } from '@angular/fire/database';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  hide = true;
  authService = inject(AuthService)
  auth = inject(Auth);
  // db = inject(Database);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // async onSubmit() {
  //   if (this.registerForm.invalid) return;

  //   const { email, password, fullName } = this.registerForm.value;

  //   try {
  //     const credential = await  createUserWithEmailAndPassword(this.auth, email, password);
  //     const user = credential.user;

  //     const dbRef = ref(this.db, 'users');
  //     await push(dbRef, {
  //       uid: user.uid,
  //       email: user.email,
  //       fullName: fullName,
  //       createdAt: new Date()
  //     });

  //     this.router.navigate(['/login']);
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //   }
  // }

  onSubmit() {
    if (this.registerForm.invalid) return;
    const { email, password } = this.registerForm.value;
    const credential = this.authService.register(email, password).then((res) => {
      if (res.user) {
        console.log('registration successfully');
        this.router.navigate(['/login']);
      }
    })
  }
}
