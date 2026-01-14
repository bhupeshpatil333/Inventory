import { Routes } from "@angular/router";
import { StockReportComponent } from "./stock-report/stock-report.component";
import { ItemDetailedRepotComponent } from "./item-detailed-repot/item-detailed-repot.component";

export const stockReportRoutes: Routes = [
    { path: '', component: StockReportComponent, title: 'Stock Report' },
    { path: 'view/:id', component: ItemDetailedRepotComponent, title: 'view Stock Item Report' },
];
