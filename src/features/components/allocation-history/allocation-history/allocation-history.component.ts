import { AllocationHistoryService } from './../services/allocation-history.service';
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
  constructor(private router: Router, private itemService: ItemService, private facilityService: FacilityService, private districtService: DistrictService, private commonService: CommonService, private allocationService: AllocationHistoryService) { }
  async ngOnInit() {
    this.fetchAllocations();
    this.districts = await this.districtService.getDistrictData();
    this.facilities = await this.facilityService.getFacilitytData();
    this.items = await this.itemService.getItemData();
    console.log('this.items: ', this.items);
  }

  async fetchAllocations() {
    this.allocationsHistory = (await this.commonService.getAll('allocationHist')).map(alloc => {
      console.log('alloc: ', alloc);
      const itemObj = this.items.find(i => i.key == alloc.item);
      console.log('itemObj: ', itemObj);
      const districtObj = this.districts.find(d => d.key === alloc.district);
      const facilityObj = this.facilities.find(f => f.key === alloc.facility);
      return {
        ...alloc,
        itemName: itemObj?.name || 'N/A',
        brand: itemObj?.brand,
        unit: itemObj?.unit || '',
        containsPerUnit: itemObj?.containsPerUnit || '',
        districtName: districtObj ? districtObj.name : alloc.district,
        facilityName: facilityObj ? facilityObj.name : alloc.facility,
        allocateQuantity: alloc.allocateQuantity || 0
      };
    });


    console.log('this.allocationsHistory: ', this.allocationsHistory);
  }

  // async fetchAllocations() {
  //   const rawAllocations = await this.commonService.getAll('allocationHist');
  //   console.log('rawAllocations: ', rawAllocations);

  //   const mappedAllocations = rawAllocations.map(alloc => {
  //     const itemObj = this.items.find(i => i.key == alloc.item);
  //     const districtObj = this.districts.find(d => d.key === alloc.district);
  //     const facilityObj = this.facilities.find(f => f.key === alloc.facility);
  //     return {
  //       ...alloc,
  //       itemName: itemObj?.name || 'N/A',
  //       brand: itemObj?.brand,
  //       unit: itemObj?.unit || '',
  //       containsPerUnit: itemObj?.containsPerUnit || '',
  //       districtName: districtObj ? districtObj.name : alloc.district,
  //       facilityName: facilityObj ? facilityObj.name : alloc.facility,
  //       allocateQuantity: alloc.allocateQuantity || 0
  //     };
  //   });

  //   // Remove duplicates and sum quantities using filter + findIndex
  //   this.allocationsHistory = mappedAllocations.filter((obj, index, self) => {
  //     const firstIndex = self.findIndex(o =>
  //       o.item === obj.item &&
  //       o.district === obj.district &&
  //       o.facility === obj.facility
  //     );

  //     if (firstIndex !== index) {
  //       // Duplicate: add quantity to the first one
  //       self[firstIndex].allocateQuantity += obj.allocateQuantity;
  //       return false; // Skip this duplicate
  //     }

  //     return true; // Keep unique
  //   });

  //   console.log('this.allocationsHistory:', this.allocationsHistory);
  // }


  getUnitConversion(item: any): { unit: string, containsPerUnit: string } {
    switch (item.unit) {
      case 'Packet':
        return { unit: 'Packet', containsPerUnit: `${item.containsPerUnit} Pieces` };
      case 'Litre':
        return { unit: 'Litre', containsPerUnit: `${item.containsPerUnit} ml` };
      case 'Kg':
        return { unit: 'Kg', containsPerUnit: `${item.containsPerUnit} g` };
      case 'Tablet':
      case 'Pieces':
        return { unit: item.unit, containsPerUnit: '-' }; // no conversion
      default:
        return { unit: item.unit, containsPerUnit: item.containsPerUnit };
    }
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
        !this.selectedDistrict || allocationHist.district === this.selectedDistrict;
      const matchesFacility =
        !this.selectedFacility || allocationHist.facility === this.selectedFacility;
      return matchesSearch && matchesDistrict && matchesFacility;
    });
  }
}
