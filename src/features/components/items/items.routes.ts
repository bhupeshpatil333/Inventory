import { Routes } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { ItemAddEditComponent } from './item-add-edit/item-add-edit.component';

export const itemRoutes: Routes = [
    { path: '', component: ItemComponent, title: 'Item Master' },
    { path: 'add', component: ItemAddEditComponent, title: 'Add Item' },
    { path: 'edit/:id', component: ItemAddEditComponent, title: 'Edit Item' },
];
