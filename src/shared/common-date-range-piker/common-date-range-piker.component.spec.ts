import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDateRangePikerComponent } from './common-date-range-piker.component';

describe('CommonDateRangePikerComponent', () => {
  let component: CommonDateRangePikerComponent;
  let fixture: ComponentFixture<CommonDateRangePikerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonDateRangePikerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonDateRangePikerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
