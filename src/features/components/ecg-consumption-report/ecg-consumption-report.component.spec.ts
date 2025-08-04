import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgConsumptionReportComponent } from './ecg-consumption-report.component';

describe('EcgConsumptionReportComponent', () => {
  let component: EcgConsumptionReportComponent;
  let fixture: ComponentFixture<EcgConsumptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcgConsumptionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcgConsumptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
