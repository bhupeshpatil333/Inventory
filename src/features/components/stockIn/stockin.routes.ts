import { Routes } from "@angular/router";
import { StockInHistoryComponent } from "./stock-in-history/stock-in-history.component";
import { StockInHistoryAddEditComponent } from "./stock-in-history-add-edit/stock-in-history-add-edit.component";

export const stockInRoutes: Routes = [
    { path: '', component: StockInHistoryComponent, title: 'Stock In' },
    { path: 'add', component: StockInHistoryAddEditComponent, title: 'Add StockIn' },
    { path: 'edit/:id', component: StockInHistoryAddEditComponent, title: 'Edit StockIn' },
];