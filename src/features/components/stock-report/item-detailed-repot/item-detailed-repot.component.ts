import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../items/service/item.service';
import { Router } from '@angular/router';
import { StockService } from '../../stockIn/stock.service';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DistrictService } from '../../../../shared/district.service';
import { FacilityService } from '../../facility/facility.service';
import { AllocationHistoryService } from '../../allocation-history/services/allocation-history.service';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-item-detailed-repot',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './item-detailed-repot.component.html',
  styleUrls: ['./item-detailed-repot.component.scss']
})
export class ItemDetailedRepotComponent implements OnInit {


  reportData: any[] = [];
  itemId: string = '';
  itemData: any;

  fromDate = new Date();
  toDate = new Date();

  constructor(
    private itemService: ItemService,
    private stockService: StockService,
    private allocationService: AllocationHistoryService,
    private commonSer: CommonService,
    private districtService: DistrictService,
    private facilityService: FacilityService
  ) { }

  async ngOnInit() {
    // await this.getStocks();
    console.log('this.reportData: ', this.reportData);
    await this.loadReport();
  }

  async loadReport() {
    const item = history.state.data;
    this.itemData = item;
    this.itemId = item?.key;
    console.log('this.itemId: ', this.itemId);

    const from = this.fromDate.toISOString();
    const to = this.toDate.toISOString();

    const stockIns = await this.stockService.getStockData();
    console.log('stockIns: ', stockIns);
    const allocations = await this.allocationService.getData();

    const filteredStockIns = stockIns.filter((s: any) => s.key === this.itemId);
    console.log('filteredStockIns: ', filteredStockIns);

    const filteredAllocations = allocations.filter((a: any) => a.key === this.itemId);

    this.reportData = [
      ...filteredStockIns.map((d: any) => ({
        date: d.date,
        source: d.source || 'Store',
        destination: d.destination || 'District',
        type: 'StockIn',
        brand: d.brand,
        quantity: d.quantity,
        stockSource: d.quantity,
        stockDestination: 0
      })),
      ...filteredAllocations.map((d: any) => ({
        date: d.date,
        source: d.district || 'District',
        destination: d.facility || 'Facility',
        type: 'StockOut',
        brand: d.brand,
        quantity: d.quantity,
        stockSource: d.stockSource || 0,
        stockDestination: d.stockDestination || 0
      }))
    ];
  }



}
