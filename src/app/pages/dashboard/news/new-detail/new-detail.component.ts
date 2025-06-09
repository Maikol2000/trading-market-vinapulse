import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsOpenApiService } from '@app/core/services';
import { LoadingComponent } from '@app/shared/components';
import { NewsArticle } from '@app/shared/models';
import { AppRouter } from '@app/utils/routers';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-new-detail',
  imports: [CommonModule, TranslateModule, LoadingComponent],
  templateUrl: './new-detail.component.html',
  styleUrl: './new-detail.component.scss',
})
export class NewDetailComponent {
  article = signal<Partial<NewsArticle>>({});
  relatedArticles = signal<Partial<NewsArticle>[]>([]);

  constructor(
    private newsService: NewsOpenApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Get article ID from route params
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(id);
    }
  }

  private loadArticle(id: string) {
    // this.newsService.getArticleById(id).subscribe({
    //   next: (article) => {
    //     this.article.set(article);
    //     this.loadRelatedArticles(article.categories);
    //   },
    //   error: (error) => {
    //     console.error('Error loading article:', error);
    //     this.router.navigate(['/news']);
    //   },
    // });
  }

  goBack() {
    this.router.navigate([AppRouter.Dashboard.News]);
  }
}
