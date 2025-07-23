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

  itemForm!: FormGroup;
  // types = ['Hospital', 'Clinic'];
  isEdit = false;
  itemId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private itemService: ItemService,) {
    this.itemForm = this.fb.group({
      name: [''],
      brand: [''],
      unit: [''],
      containsPerUnit: ['']
    });

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.itemId = id;
      console.log('this.itemId: ', this.itemId);

      this.itemService.getItemById(this.itemId).then(item => {
        if (item) {
          this.itemForm.patchValue(item);
        }
      });
    }
  }

  submit(): void {
    if (this.itemForm.valid) {
      const formData = this.itemForm.value;

      if (this.isEdit && this.itemId) {
        this.itemService.updateItem(this.itemId, formData).then(() => {
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
