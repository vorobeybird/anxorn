import { Routes } from '@angular/router';
import { MainMenuComponent } from './main.component';
import { Settings } from './settings/settings';
import { GameComponent } from './game-template/game-template';

export const menuRoutes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    children: [
      { path: 'settings', component: Settings },
      { path: "game", component: GameComponent }
    ]
  }
];