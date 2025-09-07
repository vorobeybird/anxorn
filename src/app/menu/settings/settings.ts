import { Component, inject } from '@angular/core';
import { AppTranslationService, SupportedLanguage } from '../../translation.service';
import { ButtonComponent } from "../../app.button.component";

@Component({
  selector: 'app-settings',
  imports: [ButtonComponent],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  private translationService = inject(AppTranslationService);
  public readonly languages = this.translationService.getSupportedLanguages();

  toggleTheme() {
    document.body.classList.toggle('dark-theme');
  }

  isCurrentLanguage(language: string): boolean {
    return this.translationService.getCurrentLanguage() === language;
  }

  displayLanguage(language: string) {
    return this.translationService.getLanguageDisplayName(language as SupportedLanguage);
  }

  changeLanguage(language: string) {
    this.translationService.setLanguage(language as SupportedLanguage);
  }
}
