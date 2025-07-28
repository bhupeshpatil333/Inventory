import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationHistoryComponent } from './allocation-history.component';

describe('AllocationHistoryComponent', () => {
  let component: AllocationHistoryComponent;
  let fixture: ComponentFixture<AllocationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
