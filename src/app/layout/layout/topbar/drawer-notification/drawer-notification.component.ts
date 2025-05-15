import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
}

@Component({
  selector: 'app-drawer-notification',
  imports: [CommonModule],
  templateUrl: './drawer-notification.component.html',
  styleUrl: './drawer-notification.component.scss',
})
export class DrawerNotificationComponent {
  notifications: Notification[] = [
    {
      id: '1',
      title: 'Order Executed',
      message: 'Your BTC buy order has been successfully executed',
      type: 'success',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      title: 'Price Alert',
      message: 'BTC price has reached your target of $50,000',
      type: 'info',
      timestamp: new Date(),
      read: true,
    },
    // Add more sample notifications as needed
  ];

  markAllAsRead(): void {
    this.notifications = this.notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
  }
}
