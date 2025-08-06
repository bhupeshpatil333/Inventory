import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/shared.module';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ItemService } from '../service/item.service';


@Component({
  selector: 'app-item-add-edit',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './item-add-edit.component.html',
  styleUrl: './item-add-edit.component.scss'
})
export class ItemAddEditComponent {
  initialFormValue: string = '';

  itemForm!: FormGroup;
  itemsData: any;
  isEdit = false;
  itemId: string | null = null;
  quantityUnits: string[] = ['Packet', 'Pieces', 'Litre', 'ml', 'g', 'Kg', 'Tablet'];
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private itemService: ItemService,) {
    this.itemForm = this.fb.group({
      name: [''],
      brand: [''],
      unit: [''],
      containsPerUnit: ['']
    });

  }

  // This method is called whenever the form value changes
  ngDoCheck(): void {
    const currentValue = JSON.stringify(this.itemForm.value);
    console.log('currentValue: ', currentValue);
    history.replaceState({ ...history.state, currentFormValue: currentValue }, '');
  }



  ngOnInit(): void {
    this.isEdit = history.state.isEdit;
    this.itemsData = history.state.data;

    if (this.itemsData) {
      this.itemForm.patchValue(this.itemsData);
    }

    // this is the initial value
    const initialValue = JSON.stringify(this.itemForm.value);
    console.log('initialValue: ', initialValue);
    history.replaceState({ ...history.state, initialFormValue: initialValue }, '');

  }

  submit(): void {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;

      if (this.isEdit) {
        this.itemService.updateItem(this.itemsData?.key, formData).then(() => {
          this.router.navigate(['/dashboard/items']);
        });
      } else {
        this.itemService.addItem(formData).then(() => {
          this.router.navigate(['/dashboard/items']);
        });
      }
    }
  }
}
