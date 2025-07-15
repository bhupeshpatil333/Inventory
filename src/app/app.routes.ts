import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { authGuard } from './core/guard/auth.guard';
import { loginGuard } from './core/guard/login.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../features/components/auth/auth.routes').then(m => m.authRoutes),
        canActivate: [loginGuard]
        // loadChildren: () => import('../features/components/auth/login/login.component').then(m => m.LoginComponent)
        // component: LoginComponent
    },

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },


];
