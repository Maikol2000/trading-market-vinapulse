import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WathclistTicketComponent } from './wathclist-ticket.component';

describe('WathclistTicketComponent', () => {
  let component: WathclistTicketComponent;
  let fixture: ComponentFixture<WathclistTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WathclistTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WathclistTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
