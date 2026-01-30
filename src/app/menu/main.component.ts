import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from "../app.button.component";
import {
    TranslatePipe
} from "@ngx-translate/core";
import { AppTranslationService } from '../translation.service';

interface MenuOption {
    translationKey: string; // Changed from label to translationKey
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
                    @for (option of menuOptions; track menuOptions){
                    <app-button     
                        (click)="navigateTo(option.route)" 
                        [customClass]="'menu-button'">
                        {{option.translationKey | translate}}
                    </app-button>
                    }
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
    private translationService = inject(AppTranslationService);

    constructor(private router: Router) {
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    menuOptions: MenuOption[] = [
        { translationKey: 'app.menu.newgame', route: '/newgame' },
        { translationKey: 'app.menu.menu', route: '' },
        { translationKey: 'app.menu.save', route: '/save' },
        { translationKey: 'app.menu.load', route: '/load' },
        { translationKey: 'app.menu.settings', route: '/settings' },
        { translationKey: 'app.menu.game', route: '/game' }
    ];
}