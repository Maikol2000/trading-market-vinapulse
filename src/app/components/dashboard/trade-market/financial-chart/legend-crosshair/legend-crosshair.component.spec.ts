import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendCrosshairComponent } from './legend-crosshair.component';

describe('LegendCrosshairComponent', () => {
  let component: LegendCrosshairComponent;
  let fixture: ComponentFixture<LegendCrosshairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendCrosshairComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegendCrosshairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
