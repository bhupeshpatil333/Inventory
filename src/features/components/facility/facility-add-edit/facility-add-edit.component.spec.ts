import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityAddEditComponent } from './facility-add-edit.component';

describe('FacilityAddEditComponent', () => {
  let component: FacilityAddEditComponent;
  let fixture: ComponentFixture<FacilityAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
