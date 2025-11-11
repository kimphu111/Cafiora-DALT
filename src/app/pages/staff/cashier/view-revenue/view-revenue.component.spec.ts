import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRevenueComponent } from './view-revenue.component';

describe('ViewRevenueComponent', () => {
  let component: ViewRevenueComponent;
  let fixture: ComponentFixture<ViewRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRevenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
