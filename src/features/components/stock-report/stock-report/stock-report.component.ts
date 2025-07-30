import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../items/service/item.service';
import { StockService } from '../../stockIn/stock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-report',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './stock-report.component.html',
  styleUrl: './stock-report.component.scss'
})
export class StockReportComponent implements OnInit {

  // stockReport

  filteredItems: any[] = [];
  items: any[] = [];
  stockIns: any[] = [];
  instockList: any[] = [];
  displayedColumns: string[] = ['item', 'unit', 'brand', 'type', 'inStock', 'actions'];
  constructor(private itemService: ItemService, private stockService: StockService, private router: Router) { }

  async ngOnInit() {
    this.items = await this.itemService.getItemData();
    this.stockIns = await this.stockService.getStockData();

    this.instockList = this.stockIns.map((stock: any) => {
      console.log('stock: ', stock);
      const item = this.items.find((item: any) => item.key === stock.item);
      console.log('item: ', item);
      return {
        ...stock,
        item: item?.name || '',
        brand: item?.brand || '',
        unit: item?.unit || '',
        type: item?.type || '',
        containsPerUnit: item?.containsPerUnit || '',
      };
    })
  }

  getUnitConversion(stock: any): string {
    switch (stock.unit) {
      case 'Packet':
        return `${stock.containsPerUnit} Pieces`;
      case 'Litre':
        return `${stock.containsPerUnit} ml`;
      case 'Kg':
        return `${stock.containsPerUnit} g`;
      case 'Tablet':
      case 'Pieces':
        return '-'; // no conversion
      default:
        return stock.containsPerUnit;
    }
  }

  viewData(item: any) {
    console.log('item: ', item);
    this.router.navigate(['dashboard/stockReport/view', item.key], { state: { data: item } });
  }

}
