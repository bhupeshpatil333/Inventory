import { CommonService } from './../../../../shared/services/common.service';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../items/service/item.service';
import { Router } from '@angular/router';
import { StockService } from '../stock.service';

@Component({
  selector: 'app-stock-in-history-add-edit',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './stock-in-history-add-edit.component.html',
  styleUrl: './stock-in-history-add-edit.component.scss'
})
export class StockInHistoryAddEditComponent {

  stockForm!: FormGroup;
  items: any[] = [];
  selectedItem: any = null;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService, private router: Router, private commonService: CommonService, private stocService: StockService) {
    this.stockForm = this.fb.group({
      item: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      dateOfEntry: ['', Validators.required],
      dateOfExpiry: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.items = await this.itemService.getItemData();
    this.items.sort((a, b) => a.name.localeCompare(b.name));
    this.isEdit = !!history.state.isEdit;
    if (this.isEdit && history.state.data) {
      this.stockForm.patchValue(history.state.data);
    }
  }


  async submit() {
    console.log('submit click')
    if (this.stockForm.valid) {
      const formData = this.stockForm.value;
      console.log('formData: ', formData);

      if (this.isEdit) {
        await this.stocService.updateStock(history.state.data?.key, formData)
        this.router.navigate(['dashboard/stockIn']);
      } else {
        await this.stocService.addStock(formData)
        this.router.navigate(['dashboard/stockIn']);
      }
    }
  }
}
