import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPortfolioComponent } from './order-portfolio.component';

describe('OrderPortfolioComponent', () => {
  let component: OrderPortfolioComponent;
  let fixture: ComponentFixture<OrderPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
