import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DistrictService } from '../../../../shared/district.service';
import { FacilityService } from '../../facility/facility.service';
import { ItemService } from '../service/item.service';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-item',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {
  constructor(private facilityService: FacilityService, private itemService: ItemService, private fb: FormBuilder, private router: Router, private dialog: MatDialog, private commonService: CommonService) { }
  searchText = '';
  selectedType = '';
  facilityTypes: any[] = [];
  items: any = [/* your data */];
  facilities: any = [/* your data */];
  displayedColumns: string[] = ['name', 'brand', 'type', 'unit', 'actions'];

  async ngOnInit(): Promise<void> {
    try {
      this.facilities = await this.facilityService.getFacilitytData();
      // ✅ Extract unique types from facility list
      this.facilityTypes = [...new Set(this.facilities.map((f: any) => f.type))];

      this.items = await this.itemService.getItemData();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  get filteredItems() {
    const search = (this.searchText || '').toLowerCase();
    return this.items.filter((item: any) => {
      const matchesSearch =
        (item?.name || '').toLowerCase().includes(search) ||
        (item?.brand || '').toLowerCase().includes(search);
      const matchesType =
        !this.selectedType || (item?.type || '').toLowerCase() === this.selectedType.toLowerCase();
      return matchesSearch && matchesType;
    });
  }


  addItem() {
    this.router.navigate(['dashboard/items/add']);
  }

  editItem(item: any) {
    if (item) {
      this.router.navigate(['dashboard/items/edit', item]);
    }
  }

  deleteItem(item: any) {
    // Add confirmation or service call here
    this.commonService.delete('items', item.id);
    console.log('Delete item:', item);
  }
}


