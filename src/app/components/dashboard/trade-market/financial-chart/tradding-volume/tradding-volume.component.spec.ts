import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraddingVolumeComponent } from './tradding-volume.component';

describe('TraddingVolumeComponent', () => {
  let component: TraddingVolumeComponent;
  let fixture: ComponentFixture<TraddingVolumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraddingVolumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraddingVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
