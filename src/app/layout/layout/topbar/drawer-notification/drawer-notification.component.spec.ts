import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerNotificationComponent } from './drawer-notification.component';

describe('DrawerNotificationComponent', () => {
  let component: DrawerNotificationComponent;
  let fixture: ComponentFixture<DrawerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
