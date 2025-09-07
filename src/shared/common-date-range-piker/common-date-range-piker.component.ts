import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared.module';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-common-date-range-piker',
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './common-date-range-piker.component.html',
  styleUrl: './common-date-range-piker.component.scss'
})
// export class CommonDateRangePikerComponent {
//   selected: { startDate: Dayjs, endDate: Dayjs } = {
//     startDate: dayjs(),
//     endDate: dayjs()
//   };
//   maxDate = dayjs();
//   locale = { applyLabel: 'APPLY', cancelLabel: 'CANCEL', format: 'DD-MM-YYYY' };

//   ranges: any = {
//     'Today': [dayjs(), dayjs()],
//     'Yesterday': [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
//     'Last 7 Days': [dayjs().subtract(6, 'day'), dayjs()],
//     'Last 30 Days': [dayjs().subtract(29, 'day'), dayjs()],
//     'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
//     'Last Month': [
//       dayjs().subtract(1, 'month').startOf('month'),
//       dayjs().subtract(1, 'month').endOf('month')
//     ]
//   };


//   constructor() {
//     this.resetToCurrentMonth();
//   }

//   resetToCurrentMonth() {
//     this.selected = {
//       startDate: dayjs().startOf('month'),
//       endDate: dayjs()
//     };
//   }
// }

export class CommonDateRangePikerComponent {
  // parent bindings
  // @Input() fromDate!: Date | null;
  // @Input() toDate!: Date | null;
  // @Output() fromDateChange = new EventEmitter<Date | null>();
  // @Output() toDateChange = new EventEmitter<Date | null>();

  // // internal state used by ngxDaterangepickerMd
  // // selected: { startDate: dayjs.Dayjs, endDate: dayjs.Dayjs };
  // selected: { startDate: Dayjs, endDate: Dayjs } = {
  //   startDate: dayjs(),
  //   endDate: dayjs()
  // };

  // maxDate = dayjs();
  // ranges: any = {
  //   'Today': [dayjs(), dayjs()],
  //   'Yesterday': [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
  //   'Last 7 Days': [dayjs().subtract(6, 'day'), dayjs()],
  //   'Last 30 Days': [dayjs().subtract(29, 'day'), dayjs()],
  //   'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
  //   'Last Month': [
  //     dayjs().subtract(1, 'month').startOf('month'),
  //     dayjs().subtract(1, 'month').endOf('month')
  //   ]
  // };

  // constructor() {
  //   this.resetToCurrentMonth();
  // }

  // // sync when picker value changes
  // onDateSelected(e: any) {
  //   this.fromDate = e.startDate?.toDate ? e.startDate.toDate() : e.startDate;
  //   this.toDate = e.endDate?.toDate ? e.endDate.toDate() : e.endDate;
  //   this.fromDateChange.emit(this.fromDate);
  //   this.toDateChange.emit(this.toDate);
  // }

  // resetToCurrentMonth() {
  //   this.selected = {
  //     startDate: dayjs().startOf('month'),
  //     endDate: dayjs()
  //   };
  //   this.onDateSelected(this.selected);
  // }
  @Input() fromDate!: Dayjs | null;
  @Input() toDate!: Dayjs | null;
  @Output() fromDateChange = new EventEmitter<Dayjs | null>();
  @Output() toDateChange = new EventEmitter<Dayjs | null>();
  @ViewChild('picker', { read: DaterangepickerDirective }) picker!: DaterangepickerDirective;
  // @ViewChild('pickerInput', { read: ElementRef }) pickerElementRef!: ElementRef;

  isCalendarOpening = false;

  // picker needs moment
  selected: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment(),
    endDate: moment()
  };

  maxDate = dayjs();

  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
    'Last 7 Days': [moment().subtract(6, 'day'), moment()],
    'Last 30 Days': [moment().subtract(29, 'day'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month')
    ]
  };

  constructor() {
    this.resetToCurrentMonth();
  }

  // convert Moment → Dayjs when emitting
  onDateSelected(e: any) {
    this.fromDate = e.startDate ? dayjs(e.startDate.toDate()) : null;
    this.toDate = e.endDate ? dayjs(e.endDate.toDate()) : null;

    this.fromDateChange.emit(this.fromDate);
    this.toDateChange.emit(this.toDate);
  }

  // convert Dayjs → Moment for picker
  resetToCurrentMonth() {
    const start = dayjs().startOf('month');
    const end = dayjs();

    this.selected = {
      startDate: moment(start.toDate()),
      endDate: moment(end.toDate())
    };

    this.onDateSelected(this.selected);
  }
  openCalendar() {
    // Temporarily make input not readonly
    this.isCalendarOpening = true;

    // Use setTimeout to ensure the readonly change is applied
    setTimeout(() => {
      // Method 1: Try to use the directive's open method
      if (this.picker && typeof this.picker.open === 'function') {
        try {
          this.picker.open();
          this.isCalendarOpening = false;
          return;
        } catch (error) {
          console.warn('Directive open method failed:', error);
        }
      }
    }, 10);
  }

}