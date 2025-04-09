import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalGaugeChartComponent } from './technical-gauge-chart.component';

describe('TechnicalGaugeChartComponent', () => {
  let component: TechnicalGaugeChartComponent;
  let fixture: ComponentFixture<TechnicalGaugeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalGaugeChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalGaugeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
