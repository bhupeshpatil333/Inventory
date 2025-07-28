import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationHistoryAddEditComponent } from './allocation-history-add-edit.component';

describe('AllocationHistoryAddEditComponent', () => {
  let component: AllocationHistoryAddEditComponent;
  let fixture: ComponentFixture<AllocationHistoryAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationHistoryAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationHistoryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
