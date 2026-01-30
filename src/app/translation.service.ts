import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import translationsEN from '../public/i18n/en.json';
import translationsRU from '../public/i18n/ru.json';

export type SupportedLanguage = 'en' | 'ru';

@Injectable({
  providedIn: 'root'
})
export class AppTranslationService {
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private readonly supportedLanguages: SupportedLanguage[] = ['en', 'ru'];

  constructor(private translateService: TranslateService) {
    this.initializeTranslations();
  }

  private initializeTranslations(): void {
    // Load all translation files
    this.translateService.setTranslation('en', translationsEN);
    this.translateService.setTranslation('ru', translationsRU);
    this.translateService.setFallbackLang('en');
  }

  public setLanguage(language: SupportedLanguage): void {
    if (this.supportedLanguages.includes(language)) {
      this.translateService.use(language);
      this.currentLanguageSubject.next(language);
    }
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  public getSupportedLanguages(): SupportedLanguage[] {
    return [...this.supportedLanguages];
  }

  public getTranslation(key: string): Observable<string> {
    return this.translateService.get(key);
  }

  // Helper method to get language display name
  public getLanguageDisplayName(language: SupportedLanguage): string {
    const names: Record<SupportedLanguage, string> = {
      'en': 'English',
      'ru': 'Русский'
    };
    return names[language];
  }
}