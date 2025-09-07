import { Routes } from '@angular/router';
import { MainMenuComponent } from './main.component';
import { Settings } from './settings/settings';
import { GameContainer } from '../game-container/game-container';

export const menuRoutes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    children: [
      { path: 'settings', component: Settings },
      { path: "game", component: GameContainer }
    ]
  }
];