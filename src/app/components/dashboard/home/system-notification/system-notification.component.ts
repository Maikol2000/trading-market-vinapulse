import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MessageService, NewsOpenApiService } from '@app/core/services';
import { NewsArticle } from '@app/shared/models';
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
  articlesOpenApi = signal<NewsArticle[]>([]);

  constructor(
    private messagingService: MessageService,
    private artService: NewsOpenApiService
  ) {}

  ngOnInit() {
    this.getArticle();
    this.messagingService.requestPermission();
    this.messagingService.ngMessageNotification();
  }

  getArticle() {
    this.artService.getNewsArticlesOpenApi().subscribe((art) => {
      const validArticles = art.filter(
        (article): article is NewsArticle =>
          article.id !== undefined && typeof article.id === 'number'
      );
      this.articlesOpenApi.set(validArticles);
    });
  }
}
