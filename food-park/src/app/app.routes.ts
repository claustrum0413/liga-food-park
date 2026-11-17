import { Routes } from '@angular/router';
import { authGuard } from './services/authGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then((m) => m.CadastroPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'combo',
    canActivate: [authGuard],
    loadComponent: () => import('./combo/combo.page').then((m) => m.ComboPage),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
