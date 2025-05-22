import { Component } from '@angular/core';
import { Drawer } from 'primeng/drawer';
import { OverlayBadge } from 'primeng/overlaybadge';
import { DrawerNotificationComponent } from '../drawer-notification/drawer-notification.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-badge-notification',
  imports: [OverlayBadge, Drawer, DrawerNotificationComponent, TranslateModule],
  templateUrl: './badge-notification.component.html',
  styleUrl: './badge-notification.component.scss',
})
export class BadgeNotificationComponent {
  notiAlertLength = '2';
  isVisible = false;

  setVisible = () => {
    this.isVisible = !this.isVisible;
  };
}
