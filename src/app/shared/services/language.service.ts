import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LangApp, LocalStorageKey } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang = new BehaviorSubject<LangApp>(LangApp.VI);
  currentLang$ = this.currentLang.asObservable();

  constructor(private translate: TranslateService) {
    // Kiểm tra nếu có ngôn ngữ được lưu trong localStorage
    const savedLang =
      (localStorage.getItem(LocalStorageKey.LANG) as LangApp) ?? LangApp.VI;

    // Nếu có, sử dụng ngôn ngữ đó, nếu không thì sử dụng ngôn ngữ mặc định
    this.translate.addLangs([LangApp.VI, LangApp.EN]); // Các ngôn ngữ hỗ trợ
    this.translate.setDefaultLang(LangApp.VI); // Ngôn ngữ mặc định

    if (savedLang) {
      // Sử dụng ngôn ngữ đã lưu
      this.changeLanguage(savedLang);
    } else {
      // Sử dụng ngôn ngữ mặc định
      this.changeLanguage(LangApp.VI);
    }
  }

  changeLanguage(lang: LangApp) {
    this.translate.use(lang);
    localStorage.setItem(LocalStorageKey.LANG, lang);
    this.currentLang.next(lang);
    this.translate.use(lang);
  }

  getCurrentLang(): string {
    return this.currentLang.value;
  }

  // Phương thức lấy bản dịch theo lập trình
  getTranslation(key: string, params?: Object): Promise<string> {
    return new Promise((resolve) => {
      this.translate.get(key, params).subscribe((res: string) => {
        resolve(res);
      });
    });
  }

  getInstantLang(lang: string) {
    return this.translate.instant(lang);
  }
}
