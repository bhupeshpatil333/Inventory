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
        path: 'Add',
        component: FacilityAddEditComponent,
        title: 'Add Facility',
        data: { showBackButton: true }
    },
    {
        path: 'Edit/:id',
        component: FacilityAddEditComponent,
        title: 'Edit Facility',
        data: { showBackButton: true }
    }
]