import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendIndicatorComponent } from './legend-indicator.component';

describe('LegendIndicatorComponent', () => {
  let component: LegendIndicatorComponent;
  let fixture: ComponentFixture<LegendIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegendIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegendIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
