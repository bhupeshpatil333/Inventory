import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facility',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './facility.component.html',
  styleUrl: './facility.component.scss'
})
export class FacilityComponent {

  displayedColumns: string[] = ['name', 'district', 'block', 'admin', 'action'];
  facilities = [
    { id: '1', name: 'SDH Mahua', district: 'Rajkot', block: 'Vanavcha', admin: 'Ankur Patel' },
    { id: '2', name: 'CHC Surat', district: 'Surat', block: 'Katargam', admin: 'Ravi Patil' }
  ];

  searchText = '';
  selectedDistrict = '';
  districts = ['Rajkot', 'Surat'];
  filteredFacilities = this.facilities;

  constructor(private router: Router) { }

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredFacilities = this.facilities.filter(facility =>
      (!this.searchText || facility.name.toLowerCase().includes(this.searchText.toLowerCase())) &&
      (!this.selectedDistrict || facility.district === this.selectedDistrict)
    );
  }

  addFacility() {
    this.router.navigate(['/dashboard/facility/add']);
  }

  editFacility(id: string) {
    this.router.navigate(['/dashboard/facility/edit', id]);
  }

  deleteFacility(id: string) {
    alert(`Delete facility with ID: ${id}`);
  }
}
