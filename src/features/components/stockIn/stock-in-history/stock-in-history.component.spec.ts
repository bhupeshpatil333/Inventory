import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockInHistoryComponent } from './stock-in-history.component';

describe('StockInHistoryComponent', () => {
  let component: StockInHistoryComponent;
  let fixture: ComponentFixture<StockInHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockInHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockInHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
