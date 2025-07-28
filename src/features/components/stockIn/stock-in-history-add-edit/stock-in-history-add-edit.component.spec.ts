import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInHistoryAddEditComponent } from './stock-in-history-add-edit.component';

describe('StockInHistoryAddEditComponent', () => {
  let component: StockInHistoryAddEditComponent;
  let fixture: ComponentFixture<StockInHistoryAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockInHistoryAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockInHistoryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
