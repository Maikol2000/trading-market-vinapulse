import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LanguageService } from './shared/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private translate: LanguageService) {}
}
