import { Injectable } from '@angular/core';
import { IResponse, NewsArticle } from '@app/shared/models';
import { ApiService } from '@app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private service: ApiService) {}

  getArticles() {
    return this.service.get<IResponse<NewsArticle[]>>('/news/get');
  }

  // getArticleById(id: string | null) {
  //   return this.service.get(`/news/${}`);
  // }
}
