import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DistrictService } from '../../../../shared/district.service';
import { FacilityService } from '../../facility/facility.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ItemService } from '../../items/service/item.service';

@Component({
  selector: 'app-allocation-history',
  imports: [MaterialModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './allocation-history.component.html',
  styleUrl: './allocation-history.component.scss'
})
export class AllocationHistoryComponent {
  allocationsHistory: any[] = [];
  districts: any[] = [];
  facilities: any[] = [];
  items: any[] = [];
  selectedDistrict = ''
  selectedFacility = ''
  searchText = ''
  constructor(private router: Router, private itemService: ItemService, private facilityService: FacilityService, private districtService: DistrictService, private commonService: CommonService) { }
  async ngOnInit() {
    this.fetchAllocations();

    this.districts = await this.districtService.getDistrictData();
    this.facilities = await this.facilityService.getFacilitytData();
    this.items = await this.itemService.getItemData();
    console.log('this.items: ', this.items);
  }

  async fetchAllocations() {
    this.allocationsHistory = (await this.commonService.getAll('allocationHist')).map(alloc => {
      const itemObj = this.items.find(i => i.key === alloc.item);
      const districtObj = this.districts.find(d => d.key === alloc.district);
      const facilityObj = this.facilities.find(f => f.key === alloc.facility);
      return {
        ...alloc,
        itemName: itemObj?.name || 'N/A',
        unit: itemObj?.unit || 'N/A',
        districtName: districtObj?.name || alloc.district,
        facilityName: facilityObj?.name || 'N/A',
        allocateQuantity: alloc.allocateQuantity || 0
      };
    });
  }


  deleteAllocation(id: string) {
    if (confirm('Are you sure you want to delete this allocation?')) {
      this.commonService.delete('allocationHist', id).then(() => {
        this.fetchAllocations(); // refresh list
      });
    }
  }

  edit(data: any) {
    this.router.navigate(['/dashboard/allocationHistory/edit', data.key], { state: { data: data, isEdit: true } });
  }

  get filteredData() {
    const search = (this.searchText || '').toLowerCase();
    return this.allocationsHistory.filter((allocationHist: any) => {
      const matchesSearch =
        (allocationHist?.item || '').toLowerCase().includes(search) ||
        (allocationHist?.district || '').toLowerCase().includes(search) ||
        (allocationHist?.facility || '').toLowerCase().includes(search)

      const matchesDistrict =
        !this.selectedDistrict || allocationHist.districtId === this.selectedDistrict;
      const matchesFacility =
        !this.selectedFacility || allocationHist.name === this.selectedFacility;
      return matchesSearch && matchesDistrict && matchesFacility;
    });
  }
}
