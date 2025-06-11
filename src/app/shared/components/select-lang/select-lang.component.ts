import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClickOutsideDirective } from '@app/shared/directives';
import { LangApp, LocalStorageKey } from '@app/shared/enums';
import { LanguageService } from '@app/shared/services';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-select-lang',
  imports: [CommonModule, ClickOutsideDirective, FontAwesomeModule],
  templateUrl: './select-lang.component.html',
  styleUrl: './select-lang.component.scss',
})
export class SelectLangComponent {
  isOpen = false;
  currentLang: LangApp =
    (localStorage.getItem(LocalStorageKey.LANG) as LangApp) ?? LangApp.VI; // Default language
  languages = [
    {
      code: LangApp.VI,
      label: 'Tiếng Việt',
    },
    {
      code: LangApp.EN,
      label: 'English',
    },
  ];

  faGlobe = faGlobe;

  constructor(private translate: LanguageService) {
    this.translate.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(langCode: LangApp): void {
    this.currentLang = langCode;
    this.translate.changeLanguage(langCode);
    this.isOpen = false;
    localStorage.setItem(LocalStorageKey.LANG, langCode);
  }

  getCurrentLangLabel(): string {
    const current = this.languages.find(
      (lang) => lang.code === this.currentLang
    );
    return current ? current.label : '';
  }

  onClose(): void {
    this.isOpen = false;
  }
}
