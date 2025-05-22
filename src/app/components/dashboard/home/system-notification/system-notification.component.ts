import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '@app/core/services';
import { TranslateModule } from '@ngx-translate/core';

interface Notification {
  id: string;
  userId: string;
  actionCode: 'SYSTEM';
  message: string;
  createdAt: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-system-notification',
  imports: [CommonModule, TranslateModule],
  templateUrl: './system-notification.component.html',
  styleUrl: './system-notification.component.scss',
})
export class SystemNotificationComponent implements OnInit {
  systemNotifications: Notification[] = [
    {
      id: '1',
      userId: 'user123',
      actionCode: 'SYSTEM',
      message: 'Hệ thống sẽ bảo trì vào 22:00 ngày 15/05/2024',
      createdAt: new Date('2024-05-14T15:00:00'),
      isRead: false,
    },
    {
      id: '2',
      userId: 'user123',
      actionCode: 'SYSTEM',
      message:
        'Cập nhật phiên bản mới V2.0.1 - Thêm tính năng theo dõi thị trường',
      createdAt: new Date('2024-05-13T10:30:00'),
      isRead: true,
    },
    {
      id: '3',
      userId: 'user123',
      actionCode: 'SYSTEM',
      message: 'Chú ý: Biến động thị trường BTC-USDT tăng 5% trong 1 giờ',
      createdAt: new Date('2024-05-13T08:15:00'),
      isRead: false,
    },
    {
      id: '4',
      userId: 'user123',
      actionCode: 'SYSTEM',
      message:
        'Thông báo: Nâng cấp bảo mật tài khoản - Vui lòng cập nhật mật khẩu',
      createdAt: new Date('2024-05-12T14:20:00'),
      isRead: true,
    },
    {
      id: '5',
      userId: 'user123',
      actionCode: 'SYSTEM',
      message: 'Khuyến mãi: Giảm 50% phí giao dịch trong tuần này',
      createdAt: new Date('2024-05-11T09:00:00'),
      isRead: true,
    },
  ];

  constructor(private messagingService: MessageService) {}

  ngOnInit() {
    // this.messagingService.requestPermission();
    this.messagingService.ngMessageNotification();
  }
}
