import { Routes } from '@angular/router';
import { MainMenuComponent } from './main.component';
import { Settings } from './settings/settings';

export const menuRoutes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    children: [
      { path: 'settings', component: Settings }
    ]
  }
];