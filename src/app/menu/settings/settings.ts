import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
    }
}
