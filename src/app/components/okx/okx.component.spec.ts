import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkxComponent } from './okx.component';

describe('OkxComponent', () => {
  let component: OkxComponent;
  let fixture: ComponentFixture<OkxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OkxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OkxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
