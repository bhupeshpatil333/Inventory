import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailedRepotComponent } from './item-detailed-repot.component';

describe('ItemDetailedRepotComponent', () => {
  let component: ItemDetailedRepotComponent;
  let fixture: ComponentFixture<ItemDetailedRepotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDetailedRepotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDetailedRepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
