import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageKey } from '@app/shared/enums';
import { generateUUIDV4 } from '@app/utils/generate-uuid';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {
  constructor() {
    const deviceId = localStorage.getItem(LocalStorageKey.DEVICE_ID);
    if (!deviceId) {
      const uuId = generateUUIDV4();
      localStorage.setItem(LocalStorageKey.DEVICE_ID, uuId);
    }
  }
}
