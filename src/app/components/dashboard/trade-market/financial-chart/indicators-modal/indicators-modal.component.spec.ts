import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsModalComponent } from './indicators-modal.component';

describe('IndicatorsModalComponent', () => {
  let component: IndicatorsModalComponent;
  let fixture: ComponentFixture<IndicatorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
