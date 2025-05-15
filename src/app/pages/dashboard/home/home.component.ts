import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CurrencyComponent, SystemNotificationComponent } from '@app/components/dashboard/home';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CurrencyComponent, SystemNotificationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor() {}

  ngOnInit(): void {}
}
