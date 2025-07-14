import { Routes } from '@angular/router';
import { RegisterComponent } from '../features/components/auth/register/register.component';
import { LoginComponent } from '../features/components/auth/login/login.component';
import { ProfileComponent } from '../features/components/auth/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        // loadChildren: () => import('../features/components/auth/auth.routes').then(m => m.authRoutes)
        // loadChildren: () => import('../features/components/auth/login/login.component').then(m => m.LoginComponent)
        component: LoginComponent
    },
    {
        path: 'register',
        // loadChildren: () => import('../features/components/auth/register/register.component').then(m => m.RegisterComponent)
        component: RegisterComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    }


];
