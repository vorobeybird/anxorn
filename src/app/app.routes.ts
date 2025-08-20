import { Routes } from "@angular/router";
import { MainMenuComponent } from "./menu/main.component";

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)
  }
];
