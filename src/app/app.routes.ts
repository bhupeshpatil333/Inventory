import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { authGuard } from './core/guard/auth.guard';
import { loginGuard } from './core/guard/login.guard';
import { DistrictComponent } from '../features/components/district/district.component';

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('../features/components/auth/auth.routes').then(m => m.authRoutes),
    },

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'district',
                loadChildren: () => import('../features/components/district/district.routes').then(m => m.districtRoutes),

            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];
