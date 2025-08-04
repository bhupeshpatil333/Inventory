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
import moment from 'moment';

@Component({
  selector: 'app-item-detailed-repot',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './item-detailed-repot.component.html',
  styleUrls: ['./item-detailed-repot.component.scss']
})
export class ItemDetailedRepotComponent implements OnInit {


  reportData: any[] = [];
  reportRows: any[] = [];
  itemId: string = '';
  itemData: any;
  item: any;

  fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(
    private itemService: ItemService,
    private stockService: StockService,
    private allocationService: AllocationHistoryService,
    private commonSer: CommonService,
    private districtService: DistrictService,
    private facilityService: FacilityService
  ) { }

  // async ngOnInit() {
  //   // await this.getStocks();
  //   console.log('this.reportData: ', this.reportData);
  //   await this.loadReport();
  // }

  // async loadReport() {
  //   const item = history.state.data;
  //   this.itemData = item;
  //   this.itemId = item?.key;
  //   console.log('this.itemId: ', this.itemId);

  //   const from = this.fromDate.toISOString();
  //   const to = this.toDate.toISOString();

  //   const stockIns = await this.stockService.getStockData();
  //   console.log('stockIns: ', stockIns);
  //   const allocations = await this.allocationService.getData();

  //   const filteredStockIns = stockIns.filter((s: any) => s.key === this.itemId);
  //   console.log('filteredStockIns: ', filteredStockIns);

  //   const filteredAllocations = allocations.filter((a: any) => a.key === this.itemId);

  //   this.reportData = [
  //     ...filteredStockIns.map((d: any) => ({
  //       date: d.date,
  //       source: d.source || 'Store',
  //       destination: d.destination || 'District',
  //       type: 'StockIn',
  //       brand: d.brand,
  //       quantity: d.quantity,
  //       stockSource: d.quantity,
  //       stockDestination: 0
  //     })),
  //     ...filteredAllocations.map((d: any) => ({
  //       date: d.date,
  //       source: d.district || 'District',
  //       destination: d.facility || 'Facility',
  //       type: 'StockOut',
  //       brand: d.brand,
  //       quantity: d.quantity,
  //       stockSource: d.stockSource || 0,
  //       stockDestination: d.stockDestination || 0
  //     }))
  //   ];
  // }




  async ngOnInit() {
    this.item = history.state.data;
    console.log('Selected Item:', this.item);

    // Load data from services
    const stockIn = await this.stockService.getStockData();
    const allocations = await this.allocationService.getData();
    console.log('allocations: ', allocations);
    const districts = await this.districtService.getDistrictData();
    const facilities = await this.facilityService.getFacilitytData();

    let runningStock = 0;

    const stockRows = stockIn
      .filter(s => s.key === this.item.key)
      .sort((a, b) => a.dateOfEntry?.seconds - b.dateOfEntry?.seconds)
      .map(s => {
        runningStock += s.quantity;
        return {
          date: s.dateOfEntry?.seconds
            ? new Date(s.dateOfEntry.seconds * 1000)
            : (s.date ? new Date(s.date) : null),
          type: 'StockIn',
          brand: s.brand,
          quantity: s.quantity,
          source: 'Store In',
          destination: 'Store In',
          stockSource: 0,
          stockDestination: runningStock
        };
      });

    const allocationRows = allocations
      .filter(a => a.item || a.item === this.item.key)
      .sort((a, b) => a.dateOfEntry?.seconds - b.dateOfEntry?.seconds)
      .map(a => {
        const districtName = districts.find(d => d.key === a.district)?.name;
        const facilityName = facilities.find(f => f.key === a.facility)?.name;

        const source = 'Store';
        const destination = facilityName || districtName || 'Unknown';
        const qty = a.quantity || a.allocateQuantity || 0;
        runningStock -= qty;

        return {
          date: a.dateOfEntry?.seconds
            ? new Date(a.dateOfEntry.seconds * 1000).toLocaleDateString()
            : (a.date ? new Date(a.date).toLocaleDateString() : 'N/A'),
          type: a.type || 'StockOut',
          brand: a.brand || 'N/A',
          quantity: qty,
          source,
          destination,
          stockSource: runningStock,
          stockDestination: 0
        };
      });

    this.reportRows = [...stockRows, ...allocationRows];

  }


  // ✅ Getter — automatically returns filtered data
  get filteredData(): any[] {
    if (!this.fromDate && !this.toDate) return this.reportRows;

    const from = this.fromDate ? moment(this.fromDate).startOf('day') : null;
    const to = this.toDate ? moment(this.toDate).endOf('day') : null;

    return this.reportRows.filter(row => {
      const rowDate = moment(row.date, 'DD/MM/YYYY'); // Match format if needed

      if (from && rowDate.isBefore(from)) return false;
      if (to && rowDate.isAfter(to)) return false;
      return true;
    });
  }



}
