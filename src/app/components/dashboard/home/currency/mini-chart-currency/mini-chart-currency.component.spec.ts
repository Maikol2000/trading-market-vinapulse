import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniChartCurrencyComponent } from './mini-chart-currency.component';

describe('MiniChartCurrencyComponent', () => {
  let component: MiniChartCurrencyComponent;
  let fixture: ComponentFixture<MiniChartCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniChartCurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniChartCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
