import { Component, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from "../app.button.component";
import {
    TranslateService,
    TranslatePipe
} from "@ngx-translate/core";
import translationsEN from "../../public/i18n/en.json";

interface MenuOption {
    label: string;
    route: string;
    icon?: string;
}

@Component({
    selector: 'app-main-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent, TranslatePipe],
    template: `
        <div class="container menu-layout">
        <div>{{ 'app.menu.newgame' | translate }}</div>
        <nav class="main-menu">
            <div *ngFor="let option of menuOptions">
                <app-button (click)="navigateTo(option.route)" [label]="option.label" [customClass]="'menu-button'"></app-button>
            </div>
        </nav>
        <div>
            <router-outlet></router-outlet>
        </div>
        </div>
    `,
    styles: [
        `
        .menu-layout {
            display: flex;
            height: 90vh;
        }

        .main-menu {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        `
    ]
})
export class MainMenuComponent {
    private translate = inject(TranslateService);
    constructor(private router: Router) {
        this.translate.setTranslation('en', translationsEN);
        this.translate.setFallbackLang('en');
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    menuOptions: MenuOption[] = [
        { label: 'Menu', route: '', icon: '🏠' },
        { label: 'Save', route: '/save', icon: '👤' },
        { label: 'Load', route: '/load', icon: '📂' },
        { label: 'Settings', route: '/settings', icon: '⚙️' },
        { label: 'Game', route: '/game', icon: '🎮' }
    ];
}
