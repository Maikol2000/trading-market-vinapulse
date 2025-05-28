import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewsArticle, NewsArticleOpenApi } from '@app/shared/models';
import { environment } from '@env/environment';
import { catchError, map, Observable, of } from 'rxjs';

interface RespData<T> {
  Data: T;
  Err: any;
}

@Injectable({
  providedIn: 'root',
})
export class NewsOpenApiService {
  key = environment.apiKeyOpenApi;
  private baseUrl = `https://data-api.coindesk.com/news/v1/article/list?lang=EN&limit=5&categories=BTC,ETH,LUNA,MEME,USDT&api_key=${this.key}`;

  constructor(private http: HttpClient) {}

  getNewsArticlesOpenApi(): Observable<Partial<NewsArticle>[]> {
    return this.http.get<RespData<NewsArticleOpenApi[]>>(this.baseUrl).pipe(
      map((resp) => resp.Data),
      map((articles) => {
        const article = articles.map(
          (article): Partial<NewsArticle> => ({
            id: article.ID,
            title: article.TITLE,
            author: article.AUTHORS,
            body: article.BODY,
            img: article.IMAGE_URL,
            createdBy: article.CREATED_ON,
            // tags: article.TAGS,
            // categories: article.CATEGORIES,
          })
        );
        return article;
      })
    );
  }
}
