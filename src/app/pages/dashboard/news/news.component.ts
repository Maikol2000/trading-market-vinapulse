import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppRouter } from '@app/utils/routers';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: Date;
  category: string;
  imageUrl: string;
  readTime: number;
  tags: string[];
}

@Component({
  selector: 'app-news',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  categories: string[] = [
    'Tất cả',
    'Công nghệ',
    'Thiết kế',
    'Kinh doanh',
    'Đời sống',
    'Du lịch',
  ];
  selectedCategory: string = 'Tất cả';
  sortBy: string = 'date';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    // Mock data - trong thực tế sẽ gọi API
    this.articles = [
      {
        id: 1,
        title: 'Xu hướng thiết kế web 2024: Minimalism và Performance',
        excerpt:
          'Khám phá những xu hướng thiết kế web mới nhất trong năm 2024, tập trung vào sự đơn giản và hiệu suất.',
        content: 'Nội dung chi tiết về xu hướng thiết kế...',
        author: 'Nguyễn Văn A',
        publishedDate: new Date('2024-03-15'),
        category: 'Thiết kế',
        imageUrl:
          'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=500&h=300&fit=crop',
        readTime: 5,
        tags: ['design', 'web', 'trend', 'ui/ux'],
      },
      {
        id: 2,
        title: 'Angular 17: Những tính năng mới và cải tiến đặc biệt',
        excerpt:
          'Tìm hiểu về những tính năng mới trong Angular 17 và cách chúng cải thiện trải nghiệm phát triển.',
        content: 'Nội dung chi tiết về Angular 17...',
        author: 'Trần Thị B',
        publishedDate: new Date('2024-03-10'),
        category: 'Công nghệ',
        imageUrl:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&h=300&fit=crop',
        readTime: 8,
        tags: ['angular', 'javascript', 'frontend', 'framework'],
      },
      {
        id: 3,
        title: 'Khởi nghiệp công nghệ: Từ ý tưởng đến sản phẩm',
        excerpt:
          'Hướng dẫn chi tiết về quy trình phát triển một startup công nghệ từ ý tưởng ban đầu.',
        content: 'Nội dung chi tiết về khởi nghiệp...',
        author: 'Lê Văn C',
        publishedDate: new Date('2024-03-08'),
        category: 'Kinh doanh',
        imageUrl:
          'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&h=300&fit=crop',
        readTime: 12,
        tags: ['startup', 'business', 'technology', 'entrepreneur'],
      },
      {
        id: 4,
        title: 'Work-Life Balance trong thời đại số',
        excerpt:
          'Làm thế nào để duy trì sự cân bằng giữa công việc và cuộc sống trong môi trường làm việc hiện đại.',
        content: 'Nội dung chi tiết về work-life balance...',
        author: 'Phạm Thị D',
        publishedDate: new Date('2024-03-05'),
        category: 'Đời sống',
        imageUrl:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop',
        readTime: 6,
        tags: ['lifestyle', 'work', 'balance', 'wellness'],
      },
      {
        id: 5,
        title: 'Du lịch Việt Nam: 10 điểm đến không thể bỏ qua',
        excerpt:
          'Khám phá những điểm đến tuyệt vời nhất Việt Nam qua góc nhìn của người trong cuộc.',
        content: 'Nội dung chi tiết về du lịch...',
        author: 'Hoàng Văn E',
        publishedDate: new Date('2024-03-01'),
        category: 'Du lịch',
        imageUrl:
          'https://images.unsplash.com/photo-1528127269322-539801943592?w=500&h=300&fit=crop',
        readTime: 10,
        tags: ['travel', 'vietnam', 'tourism', 'culture'],
      },
    ];

    this.filteredArticles = [...this.articles];
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'Tất cả') {
      this.filteredArticles = [...this.articles];
    } else {
      this.filteredArticles = this.articles.filter(
        (article) => article.category === category
      );
    }
    this.sortArticles();
  }

  sortArticles() {
    switch (this.sortBy) {
      case 'date':
        this.filteredArticles.sort(
          (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()
        );
        break;
      case 'title':
        this.filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        this.filteredArticles.sort((a, b) => a.author.localeCompare(b.author));
        break;
    }
  }

  navigateToDetail(id: number) {
    this.router.navigate([AppRouter.Dashboard.NewDetail(id.toString())]);
  }
}
