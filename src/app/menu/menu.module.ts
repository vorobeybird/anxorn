import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainMenuComponent } from './main.component';
import { menuRoutes } from './menu.routes';
import { ButtonComponent } from '../app.button.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(menuRoutes),
        MainMenuComponent,
        ButtonComponent
    ],
    exports: [MainMenuComponent],
})
export class MenuModule { }