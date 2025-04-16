import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorsSelectorComponent } from './indicators-selector.component';

describe('IndicatorsSelectorComponent', () => {
  let component: IndicatorsSelectorComponent;
  let fixture: ComponentFixture<IndicatorsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorsSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
