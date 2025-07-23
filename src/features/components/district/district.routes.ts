import { Routes } from '@angular/router';
import { DistrictFormComponent } from './district-form/district-form.component';
import { DistrictComponent } from './district.component';

export const districtRoutes: Routes = [
    { path: '', component: DistrictComponent, title: 'District' },
    { path: 'add', component: DistrictFormComponent, title: 'Add District' },
    { path: 'edit/:id', component: DistrictFormComponent, title: 'Edit Ditsrict' },
];
