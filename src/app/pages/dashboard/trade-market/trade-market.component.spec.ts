import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeMarketComponent } from './trade-market.component';

describe('TradeMarketComponent', () => {
  let component: TradeMarketComponent;
  let fixture: ComponentFixture<TradeMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeMarketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
