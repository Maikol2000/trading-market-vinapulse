import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Drawer } from 'primeng/drawer';
import { DrawerNotificationComponent } from '../drawer-notification/drawer-notification.component';

@Component({
  selector: 'app-badge-notification',
  imports: [Drawer, DrawerNotificationComponent, TranslateModule],
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
