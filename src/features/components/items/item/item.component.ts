import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DistrictService } from '../../../../shared/district.service';
import { FacilityService } from '../../facility/facility.service';
import { ItemService } from '../service/item.service';

@Component({
  selector: 'app-item',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {
  constructor(private facilityService: FacilityService, private itemService: ItemService, private fb: FormBuilder, private router: Router, private dialog: MatDialog) { }
  searchText = '';
  selectedType = '';
  typeArray: any[] = [];
  items: any = [/* your data */];
  facilities: any = [/* your data */];
  displayedColumns: string[] = ['name', 'brand', 'type', 'unit', 'actions'];

  ngOnInit(): void {
    this.facilityService.getFacilitytData().then((facility) => {
      this.facilities = facility;

      this.itemService.getItemData().then((item) => {
        this.items = item.map(itm => {
          const matchedFacility = this.facilities.find((f: any) => f.type === itm.type);
          return {
            ...itm,
            type: matchedFacility?.type || 'NA'
          };
        });
        // ✅ Extract and store unique types
        const types = this.items.map((i: any) => i.type).filter((t: any) => !!t); // remove null/undefined
        this.typeArray = [...new Set(types)];

        console.log('Unique Types:', this.typeArray);
      })
    })
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
    console.log('Delete item:', item);
  }
}


