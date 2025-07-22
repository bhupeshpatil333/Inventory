import { Routes } from "@angular/router";
import { FacilityComponent } from "./facility/facility.component";
import { FacilityAddEditComponent } from "./facility-add-edit/facility-add-edit.component";

export const facilityRoutes: Routes = [
    {
        path: '',
        component: FacilityComponent,
        title: 'Facility',
        data: { showBackButton: false }
    },
    {
        path: 'add',
        component: FacilityAddEditComponent,
        title: 'Add Facility',
        data: { showBackButton: true }
    },
    {
        path: 'edit/:id',
        component: FacilityAddEditComponent,
        title: 'Edit Facility',
        data: { showBackButton: true }
    }
]