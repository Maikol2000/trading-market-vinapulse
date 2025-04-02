import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NagativeValuesComponent } from './nagative-values.component';

describe('NagativeValuesComponent', () => {
  let component: NagativeValuesComponent;
  let fixture: ComponentFixture<NagativeValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NagativeValuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NagativeValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
