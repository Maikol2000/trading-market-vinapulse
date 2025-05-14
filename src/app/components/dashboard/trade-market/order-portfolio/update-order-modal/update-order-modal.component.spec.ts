import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrderModalComponent } from './update-order-modal.component';

describe('UpdateOrderModalComponent', () => {
  let component: UpdateOrderModalComponent;
  let fixture: ComponentFixture<UpdateOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOrderModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
