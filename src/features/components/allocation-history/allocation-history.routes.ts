import { Routes } from "@angular/router";
import { AllocationHistoryAddEditComponent } from "./allocation-history-add-edit/allocation-history-add-edit.component";
import { AllocationHistoryComponent } from "./allocation-history/allocation-history.component";

export const allocationRoutes: Routes = [
    { path: '', component: AllocationHistoryComponent, title: 'Allocation History' },
    { path: 'add', component: AllocationHistoryAddEditComponent, title: 'Add Allocation' },
    { path: 'edit/:id', component: AllocationHistoryAddEditComponent, title: 'Edit Allocation' },
];