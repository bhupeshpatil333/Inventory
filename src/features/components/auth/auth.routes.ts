import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { loginGuard } from '../../../app/core/guard/login.guard';
import { authGuard } from '../../../app/core/guard/auth.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password/forget-password.component';

export const authRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [authGuard],
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authGuard],
    },
    {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        canActivate: [authGuard],
    },

];