import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MaterialModule } from '../shared.module';
import { CommonDateRangePikerComponent } from './common-date-range-piker.component';
import moment from 'moment';
import dayjs from 'dayjs';

describe('CommonDateRangePikerComponent', () => {
  let component: CommonDateRangePikerComponent;
  let fixture: ComponentFixture<CommonDateRangePikerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        NgxDaterangepickerMd.forRoot(),
        CommonDateRangePikerComponent
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CommonDateRangePikerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with proper ranges', () => {
    expect(component.ranges).toBeDefined();
    expect(component.ranges['Today']).toBeDefined();
    expect(component.ranges['Yesterday']).toBeDefined();
    expect(component.ranges['Last 7 Days']).toBeDefined();
    expect(component.ranges['Last 30 Days']).toBeDefined();
    expect(component.ranges['This Month']).toBeDefined();
    expect(component.ranges['Last Month']).toBeDefined();
  });

  it('should have correct locale configuration', () => {
    expect(component.locale.firstDay).toBe(1); // Monday
    expect(component.locale.format).toBe('DD-MM-YYYY');
    expect(component.locale.applyLabel).toBe('Apply');
    expect(component.locale.cancelLabel).toBe('Cancel');
  });

  it('should emit date changes when onDateSelected is called', () => {
    spyOn(component.fromDateChange, 'emit');
    spyOn(component.toDateChange, 'emit');

    const testEvent = {
      startDate: moment(),
      endDate: moment().add(1, 'day')
    };

    component.onDateSelected(testEvent);

    expect(component.fromDateChange.emit).toHaveBeenCalled();
    expect(component.toDateChange.emit).toHaveBeenCalled();
  });

  it('should reset to current month correctly', () => {
    component.resetToCurrentMonth();

    expect(component.selected.startDate.format('YYYY-MM-DD'))
      .toBe(moment().startOf('month').format('YYYY-MM-DD'));
    expect(component.selected.endDate.format('YYYY-MM-DD'))
      .toBe(moment().format('YYYY-MM-DD'));
  });

  it('should have ranges with moment objects', () => {
    Object.values(component.ranges).forEach((range: any) => {
      expect(Array.isArray(range)).toBe(true);
      expect(range.length).toBe(2);
      expect(moment.isMoment(range[0])).toBe(true);
      expect(moment.isMoment(range[1])).toBe(true);
    });
  });

  it('should configure moment locale for Monday start', () => {
    const locale = moment.localeData();
    expect(locale.firstDayOfWeek()).toBe(1); // Monday
  });
});
