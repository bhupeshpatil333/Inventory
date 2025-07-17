import { Routes } from '@angular/router';
import { DistrictFormComponent } from './district-form/district-form.component';
import { DistrictComponent } from './district.component';

export const districtRoutes: Routes = [
    { path: '', component: DistrictComponent },
    { path: 'add', component: DistrictFormComponent },
    { path: 'edit/:id', component: DistrictFormComponent },
];
