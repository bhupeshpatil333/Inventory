import { itemRoutes } from './../../items/items.routes';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from '../../../../shared/services/common.service';
import { StockService } from '../stock.service';
import { ItemService } from '../../items/service/item.service';

@Component({
  selector: 'app-stock-in-history',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './stock-in-history.component.html',
  styleUrl: './stock-in-history.component.scss'
})
export class StockInHistoryComponent implements OnInit {

  searchText: string = '';
  displayedColumns = ['date', 'itemName', 'brand', 'unit', 'quantity', 'action'];
  stockIns: any[] = [];
  items: any[] = [];
  mappedStockIns: any[] = [];
  constructor(private fb: FormBuilder, private itemService: ItemService, private router: Router, private dialog: MatDialog, private commonService: CommonService, private stockService: StockService) { }

  async ngOnInit() {

    this.getStocks();
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


  async getStocks() {
    this.items = await this.itemService.getItemData();
    console.log(' this.items: ', this.items);
    this.stockIns = await this.stockService.getStockData();

    this.stockIns = this.stockIns.map((stock: any) => {
      const matchedItem = this.items.find((item: any) => item.key === stock.item);
      return {
        ...stock,
        item: matchedItem?.name || '',
        brand: matchedItem?.brand || '',
        unit: matchedItem?.unit || '',
        containsPerUnit: matchedItem?.containsPerUnit || '',
      };
    });
    console.log('this.stockIns: ', this.stockIns);
  }


  add() {
    this.router.navigate(['dashboard/stockIn/add']);
  }
  editStock(data: any) {
    this.router.navigate(['dashboard/stockIn/edit', data.key], { state: { data: data, isEdit: true } });
  }
  deleteSTock(id: string) {
    this.commonService.delete('stockIn', id);
  }

  get filteredStocks() {
    const search = (this.searchText || '').toLowerCase();
    return this.stockIns.filter((item: any) => {
      const matchesSearch =
        (item?.item || '').toLowerCase().includes(search) ||
        (item?.brand || '').toLowerCase().includes(search) ||
        (item?.unit || '').toLowerCase().includes(search);


      return matchesSearch;
    });
  }

}
