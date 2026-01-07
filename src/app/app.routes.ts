import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { authGuard } from './auth/auth-guard';

import { CharacterListComponent } from './character-list/character-list';
import { CharacterCreateComponent } from './character-create/character-create';
import { CharacterEditComponent } from './character-edit/character-edit';

export const routes: Routes = [
  // ─────────────────────────────────────────────
  // Public
  // ─────────────────────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // ─────────────────────────────────────────────
  // Protected (auth required)
  // ─────────────────────────────────────────────
  {
    path: 'characters',
    component: CharacterListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'characters/new',
    component: CharacterCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'characters/:id/edit',
    component: CharacterEditComponent,
    canActivate: [authGuard],
  },

  // ─────────────────────────────────────────────
  // Fallback
  // ─────────────────────────────────────────────
  /*
  Angular lit les routes de haut en bas, dans l’ordre :

  Il teste la première route

  Si ça ne matche pas, il passe à la suivante

  Dès qu’il trouve un match → il s’arrête

  S’il arrive à la fin sans match → **

  C’est pour ça que ** doit toujours être en dernier.
  */
  {
    path: '**',
    redirectTo: 'login',
  },
];
