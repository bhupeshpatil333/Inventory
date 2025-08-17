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

  // newly added:
  sortColumn: string = '';
  sortDirection: string = '';

  reportRows: any[] = [];
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

  // Called when clicking the Date header
  sortData(column: string) {
    if (this.sortColumn === column) {
      // Cycle: '' → asc → desc → ''
      if (this.sortDirection === '') {
        this.sortDirection = 'asc';
      } else if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        this.sortDirection = '';
      }
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  // For icon rendering
  getSortDirection(column: string) {
    return this.sortColumn === column ? this.sortDirection : '';
  }


  // ✅ Getter — returns filtered + sorted data
  get filteredData(): any[] {
    // Step 1: Apply date range filter
    let data = this.reportRows;
    if (this.fromDate || this.toDate) {
      const from = this.fromDate ? moment(this.fromDate).startOf('day') : null;
      const to = this.toDate ? moment(this.toDate).endOf('day') : null;

      data = data.filter(row => {
        const rowDate = moment(row.date, 'DD/MM/YYYY'); // adjust format if needed
        if (from && rowDate.isBefore(from)) return false;
        if (to && rowDate.isAfter(to)) return false;
        return true;
      });
    }

    // Step 2: Apply sorting (only if a sort column is set)
    if (this.sortColumn && this.sortDirection) {
      data = [...data].sort((a, b) => {
        let valueA = a[this.sortColumn];
        let valueB = b[this.sortColumn];

        // Special handling for date
        if (this.sortColumn === 'date') {
          valueA = new Date(valueA).getTime();
          valueB = new Date(valueB).getTime();
        }

        if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }




}
