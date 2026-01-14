import { updateDoc } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/shared.module';
import { FormGroup, FormBuilder, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-work-settings',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './work-settings.component.html',
  styleUrl: './work-settings.component.scss'
})
export class WorkSettingsComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  docId: string | null = null;
  selectedYear!: number;
  years: number[] = [];

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private fb: FormBuilder,
    private workSettingsService: CommonService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      monthsArray: this.fb.array([])
    });
    this.createMonthsControls();  // <-- Add this
    this.loadYears();
  }

  get monthsArray(): FormArray {
    return this.form.get('monthsArray') as FormArray;
  }

  get dataSource() {
    return this.monthsArray.controls;
  }

  createMonthsControls() {
    this.monthsArray.clear();
    this.months.forEach(month => {
      this.monthsArray.push(this.fb.group({
        month: [month],
        workingDays: [null]
      }));
    });
  }

  async loadYears() {
    const data = await this.workSettingsService.getAll('workSettings') || [];
    this.years = [...new Set(data.map((item: any) => item.year))].sort();
  }

  async onYearSelection(event: any) {
    if (event.value === 'add-new') {
      this.addNewYear();
    } else {
      this.selectedYear = event.value;
      await this.onYearChange();
    }
  }

  async onYearChange() {
    console.log('Year changed:', this.selectedYear);
    if (!this.selectedYear) return;

    this.createMonthsControls();
    this.isEditMode = false;
    this.docId = null;

    const data = await this.workSettingsService.getAll('workSettings') || [];
    const yearData = data.find((item: any) => item.year === this.selectedYear);

    if (yearData) {
      this.docId = yearData.key;
      this.isEditMode = true;

      this.monthsArray.controls.forEach(ctrl => {
        const monthName = ctrl.get('month')?.value;
        ctrl.get('workingDays')?.setValue(yearData.months?.[monthName] ?? null, { emitEvent: false });
      });

      // 👇 Force UI refresh by reassigning form reference
      this.form = this.fb.group({
        monthsArray: this.monthsArray
      });
    }
  }


  addNewYear() {
    const maxYear = this.years.length ? Math.max(...this.years) : new Date().getFullYear();
    const newYear = maxYear + 1;

    this.years.push(newYear);
    this.selectedYear = newYear;
    // Sirf workingDays reset karo, month names same rahenge
    this.monthsArray.controls.forEach(ctrl => {
      ctrl.get('workingDays')?.reset(null, { emitEvent: false });
    });

    this.isEditMode = false;
    this.docId = null;
  }

  async save() {
    if (this.form.invalid || !this.selectedYear) return;
    const monthsMap: any = {};
    this.monthsArray.value.forEach((m: any) => {
      monthsMap[m.month] = m.workingDays ?? null;
    });

    const payload: any = {
      year: this.selectedYear,
      months: monthsMap,
      updatedAt: new Date()
    };

    if (this.isEditMode && this.docId) {
      await this.workSettingsService.update('workSettings', this.docId, payload);
      alert('Updated successfully!');
    } else {
      payload['createdAt'] = new Date();
      await this.workSettingsService.add('workSettings', payload);
      alert('Saved successfully!');
      this.isEditMode = true;
    }
    await this.loadYears();
  }
}

