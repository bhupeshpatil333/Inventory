import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { authGuard } from './core/guard/auth.guard';
import { loginGuard } from './core/guard/login.guard';
import { DistrictComponent } from '../features/components/district/district.component';
import { EcgConsumptionReportComponent } from '../features/components/ecg-consumption-report/ecg-consumption-report.component';
import { EmployeeAttendenceComponent } from '../features/components/employee-attendence/employee-attendence/employee-attendence.component';

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
            },
            {
                path: 'stockIn',
                loadChildren: () => import('../features/components/stockIn/stockin.routes').then(m => m.stockInRoutes),
            },
            {
                path: 'allocationHistory',
                loadChildren: () => import('../features/components/allocation-history/allocation-history.routes').then(m => m.allocationRoutes),
            },
            {
                path: 'stockReport',
                loadChildren: () => import('../features/components/stock-report/stock-report.routes').then(m => m.stockReportRoutes),
            },
            {
                path: 'ecg-report',
                component: EcgConsumptionReportComponent
            },
            {
                path: 'emp-report/:id',
                component: EmployeeAttendenceComponent
            },

        ]
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];
