import { FacilityService } from './../facility.service';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DistrictService } from '../../../../shared/district.service';

@Component({
  selector: 'app-facility',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './facility.component.html',
  styleUrl: './facility.component.scss'
})
export class FacilityComponent {

  displayedColumns: string[] = ['name', 'district', 'block', 'admin', 'action'];
  facilities: any[] = [];
  districts: any[] = [];
  uniqueDistricts: string[] = [];
  searchText = '';
  selectedDistrict = '';
  filteredFacilities = this.facilities;

  constructor(private router: Router, private facilityService: FacilityService, private districtService: DistrictService) { }

  async ngOnInit() {

    await this.loadData();
  }

  async loadData() {
    try {
      this.districts = await this.districtService.getDistrictData();
      console.log('this.districts: ', this.districts);
      const facilities = await this.facilityService.getFacilitytData();
      this.facilities = facilities;
      console.log('this.facilities: ', this.facilities);

    } catch (error) {
      console.error('Error loading data:', error);
    }
  }




  get filteredData() {
    const search = (this.searchText || '').toLowerCase();
    return this.facilities.filter((facility: any) => {
      const matchesSearch =
        (facility?.name || '').toLowerCase().includes(search) ||
        (facility?.district || '').toLowerCase().includes(search) ||
        (facility?.block || '').toLowerCase().includes(search) ||
        (facility?.adminName || '').toLowerCase().includes(search);

      const matchesDistrict =
        !this.selectedDistrict || facility.districtId === this.selectedDistrict;
      return matchesSearch && matchesDistrict;
    });
  }

  addFacility() {
    this.router.navigate(['/dashboard/facility/Add']);
  }

  editFacility(data: any) {
    // this.router.navigate(['/dashboard/facility/Edit', id]);
    this.router.navigate(['/dashboard/facility/Edit', data.key], { state: { data: data } });
  }

  async deleteFacility(id: string) {
    alert(`Delete facility with ID: ${id}`);
    await this.facilityService.deleteFacility(id);
    await this.loadData();
  }
}
