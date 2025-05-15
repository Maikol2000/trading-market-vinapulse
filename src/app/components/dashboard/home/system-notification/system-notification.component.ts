import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs/operators';

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
  imports: [CommonModule],
  templateUrl: './system-notification.component.html',
  styleUrl: './system-notification.component.scss',
})
export class SystemNotificationComponent {
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

  constructor() // private firestore: AngularFirestore,
  {}

  ngOnInit() {
    // this.loadSystemNotifications();
  }

  // loadSystemNotifications() {
  //   this.firestore
  //     .collection<Notification>('notifications', (ref) =>
  //       ref
  //         .where('userId', '==', 'current_user_id') // Thay bằng userId thực tế
  //         .where('actionCode', '==', 'SYSTEM')
  //         .orderBy('createdAt', 'desc')
  //     )
  //     .snapshotChanges()
  //     .pipe(
  //       map((actions) =>
  //         actions.map((a) => {
  //           const data = a.payload.doc.data() as Notification;
  //           const { id: _, ...rest } = data;
  //           return { id: a.payload.doc.id, ...rest };
  //         })
  //       )
  //     )
  //     .subscribe((data) => {
  //       this.systemNotifications = data;
  //     });
  // }

  // markAsRead(notification: Notification) {
  //   this.firestore
  //     .collection('notifications')
  //     .doc(notification.id)
  //     .update({ isRead: true })
  //     .then(() => {
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Thành công',
  //         detail: 'Đã đánh dấu thông báo là đã đọc',
  //       });
  //     });
  // }

  // markAllAsRead() {
  //   const batch = this.firestore.firestore.batch();
  //   this.systemNotifications
  //     .filter((n) => !n.isRead)
  //     .forEach((n) => {
  //       const ref = this.firestore.collection('notifications').doc(n.id).ref;
  //       batch.update(ref, { isRead: true });
  //     });
  //   batch.commit().then(() => {
  //     this.messageService.add({
  //       severity: 'success',
  //       summary: 'Thành công',
  //       detail: 'Đã đánh dấu tất cả là đã đọc',
  //     });
  //   });
  // }
}
