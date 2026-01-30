import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainMenuComponent } from './main.component';
import { menuRoutes } from './menu.routes';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(menuRoutes),
        MainMenuComponent,
    ],
    exports: [],
})
export class MenuModule { }