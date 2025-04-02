import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CurrencyComponent } from '@app/components/home';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CurrencyComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor() {}

  ngOnInit(): void {}
}
