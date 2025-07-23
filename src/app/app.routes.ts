import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { authGuard } from './core/guard/auth.guard';
import { loginGuard } from './core/guard/login.guard';
import { DistrictComponent } from '../features/components/district/district.component';

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('../features/components/auth/auth.routes').then(m => m.authRoutes),
        title: 'Login'
    },

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        title: 'Dashboard',
        children: [
            {
                path: 'district',
                loadChildren: () => import('../features/components/district/district.routes').then(m => m.districtRoutes),

            },
            {
                path: 'facility',
                loadChildren: () => import('../features/components/facility/facility.routes').then(m => m.facilityRoutes),
            },
            {
                path: 'items',
                loadChildren: () => import('../features/components/items/items.routes').then(m => m.itemRoutes),
            }

        ]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];
