import { AllocationHistoryService } from './../services/allocation-history.service';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DistrictService } from '../../../../shared/district.service';
import { FacilityService } from '../../facility/facility.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ItemService } from '../../items/service/item.service';
import { CommonTableComponent, ColumnConfig } from '../../../../shared/common-table/common-table.component';

type AllocationHistory = {
    key: string;
    item: string;
    district: string;
    facility: string;
    createdAt: Date;
    itemInfo: string;
    unitInfo: string;
    districtName: string;
    facilityName: string;
    allocateQuantity: number;
};

@Component({
    selector: 'app-allocation-history',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, RouterLink, CommonTableComponent],
    templateUrl: './allocation-history.component.html',
    styleUrl: './allocation-history.component.scss'
})
export class AllocationHistoryComponent implements OnInit {
    loading = false;
    allocationsHistory: AllocationHistory[] = [];
    districts: any[] = [];
    facilities: any[] = [];
    items: any[] = [];
    selectedDistrict = '';
    selectedFacility = '';
    searchText = '';

    columns: ColumnConfig[] = [
        { key: 'createdAt', header: 'Date', type: 'date', sortable: true },
        { key: 'itemInfo', header: 'Item', type: 'text' },
        { key: 'unitInfo', header: 'Unit', type: 'text' },
        { key: 'districtName', header: 'District', type: 'text' },
        { key: 'facilityName', header: 'Facility', type: 'text' },
        { key: 'allocateQuantity', header: 'Quantity', type: 'text' },
        { key: 'actions', header: 'Actions', type: 'actions', actions: ['edit', 'delete'] }
    ];

    constructor(
        private router: Router,
        private itemService: ItemService,
        private facilityService: FacilityService,
        private districtService: DistrictService,
        private commonService: CommonService,
        private allocationService: AllocationHistoryService
    ) { }

    async ngOnInit() {
        this.loading = true;
        try {
            await Promise.all([
                this.districtService.getDistrictData().then(data => this.districts = data),
                this.facilityService.getFacilitytData().then(data => this.facilities = data),
                this.itemService.getItemData().then(data => this.items = data)
            ]);
            await this.fetchAllocations();
        } finally {
            this.loading = false;
        }
    }

    async fetchAllocations() {
        try {
            const allocations = await this.commonService.getAll('allocationHist');
            this.allocationsHistory = allocations.map(alloc => {
                const itemObj = this.items.find(i => i.key == alloc.item);
                const districtObj = this.districts.find(d => d.key === alloc.district);
                const facilityObj = this.facilities.find(f => f.key === alloc.facility);

                return {
                    ...alloc,
                    itemInfo: `${itemObj?.name || 'N/A'} ${itemObj?.brand || ''}`,
                    unitInfo: `${itemObj?.unit || ''} ${itemObj?.containsPerUnit || ''}`,
                    districtName: districtObj ? districtObj.name : alloc.district,
                    facilityName: facilityObj ? facilityObj.name : alloc.facility || '-',
                    allocateQuantity: alloc.allocateQuantity || 0
                } as AllocationHistory;
            });
        } catch (error) {
            console.error('Error fetching allocations:', error);
            this.allocationsHistory = [];
        }
    }

    edit(data: AllocationHistory) {
        this.router.navigate(['/dashboard/allocationHistory/edit', data.key], {
            state: { data: data, isEdit: true }
        });
    }

    deleteAllocation(id: string) {
        if (confirm('Are you sure you want to delete this allocation?')) {
            this.commonService.delete('allocationHist', id).then(() => {
                this.fetchAllocations();
            });
        }
    }

    get filteredData() {
        const search = (this.searchText || '').toLowerCase();
        return this.allocationsHistory.filter(alloc => {
            const matchesSearch =
                (alloc.itemInfo || '').toLowerCase().includes(search) ||
                (alloc.districtName || '').toLowerCase().includes(search) ||
                (alloc.facilityName || '').toLowerCase().includes(search);

            const matchesDistrict =
                !this.selectedDistrict || alloc.district === this.selectedDistrict;
            const matchesFacility =
                !this.selectedFacility || alloc.facility === this.selectedFacility;

            return matchesSearch && matchesDistrict && matchesFacility;
        });
    }
}
