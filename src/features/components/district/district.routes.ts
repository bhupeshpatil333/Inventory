import { Routes } from '@angular/router';
import { DistrictFormComponent } from './district-form/district-form.component';
import { DistrictComponent } from './district.component';

export const districtRoutes: Routes = [
    { path: '', component: DistrictComponent, title: 'District', data: { showBackButton: false } },
    { path: 'add', component: DistrictFormComponent, title: 'Add District', data: { showBackButton: true } },
    { path: 'edit/:id', component: DistrictFormComponent, title: 'Edit Ditsrict', data: { showBackButton: true } },
];
