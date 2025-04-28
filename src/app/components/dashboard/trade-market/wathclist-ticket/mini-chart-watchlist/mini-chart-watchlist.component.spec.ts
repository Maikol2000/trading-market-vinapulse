import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniChartWatchlistComponent } from './mini-chart-watchlist.component';

describe('MiniChartWatchlistComponent', () => {
  let component: MiniChartWatchlistComponent;
  let fixture: ComponentFixture<MiniChartWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniChartWatchlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniChartWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
