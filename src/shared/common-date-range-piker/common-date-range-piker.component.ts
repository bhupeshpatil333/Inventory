import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
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
export class CommonDateRangePikerComponent implements OnInit {
  @Input() fromDate!: Dayjs | null;
  @Input() toDate!: Dayjs | null;
  @Output() fromDateChange = new EventEmitter<Dayjs | null>();
  @Output() toDateChange = new EventEmitter<Dayjs | null>();
  @ViewChild('picker', { read: DaterangepickerDirective }) picker!: DaterangepickerDirective;

  // Selected date range for the picker (using moment as required by ngx-daterangepicker-material)
  selected: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment(),
    endDate: moment()
  };

  // Maximum date allowed
  maxDate = moment();

  // Predefined ranges for the sidebar
  ranges: any = {};

  // Locale configuration
  locale = {
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    format: 'DD-MM-YYYY',
    customRangeLabel: 'Custom Range',
    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    firstDay: 1 // Monday as first day
  };

  constructor() {
    this.initializeMomentLocale();
    this.initializeRanges();
  }

  ngOnInit() {
    this.resetToCurrentMonth();
  }

  /**
   * Configure moment.js locale for Monday as first day of week
   */
  private initializeMomentLocale(): void {
    moment.locale('en', {
      week: {
        dow: 1, // Monday is the first day of the week
        doy: 4  // Used to determine the first week of the year
      }
    });
  }

  /**
   * Initialize predefined date ranges for the sidebar
   */
  private initializeRanges(): void {
    this.ranges = {
      'Today': [moment().startOf('day'), moment().endOf('day')],
      'Yesterday': [
        moment().subtract(1, 'day').startOf('day'),
        moment().subtract(1, 'day').endOf('day')
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days').startOf('day'),
        moment().endOf('day')
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days').startOf('day'),
        moment().endOf('day')
      ],
      'This Month': [
        moment().startOf('month'),
        moment().endOf('month')
      ],
      'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month')
      ]
    };
  }

  /**
   * Handle date selection from the picker
   * Convert moment objects to dayjs and emit changes
   */
  onDateSelected(event: any): void {
    if (event && event.startDate && event.endDate) {
      this.fromDate = dayjs(event.startDate.toDate());
      this.toDate = dayjs(event.endDate.toDate());

      this.fromDateChange.emit(this.fromDate);
      this.toDateChange.emit(this.toDate);
    }
  }

  /**
   * Reset the selected range to current month
   */
  resetToCurrentMonth(): void {
    const start = moment().startOf('month');
    const end = moment();

    this.selected = {
      startDate: start,
      endDate: end
    };

    // Trigger the selection event
    this.onDateSelected(this.selected);
  }

  /**
   * Programmatically open the calendar
   */
  openCalendar(): void {
    if (this.picker && typeof this.picker.open === 'function') {
      try {
        this.picker.open();
      } catch (error) {
        console.warn('Error opening calendar:', error);
      }
    } else {
      console.warn('Date picker not available');
    }
  }
}