import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { CheckEmailComponent } from './auth/check-email/check-email';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email';
import { EmailConfirmedComponent } from './auth/email-confirmed/email-confirmed';
import { authGuard } from './auth/auth-guard';

import { CharacterListComponent } from './character-list/character-list';
import { CharacterCreateComponent } from './character-create/character-create';
import { CharacterEditComponent } from './character-edit/character-edit';
import { RegisterComponent } from './auth/register/register';
import { ResendConfirmationComponent } from './auth/resend-confirmation/resend-confirmation';
import { AuthRedirectComponent } from './auth/auth-redirect/auth-redirect';
import { CharacterDetailComponent } from './character-detail/character-detail';

export const routes: Routes = [
  // ─────────────────────────────────────────────
  // Public
  // ─────────────────────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'check-email', component: CheckEmailComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'email-confirmed', component: EmailConfirmedComponent },
  { path: 'resend-cofirmation', component: ResendConfirmationComponent },

  // ─────────────────────────────────────────────
  // Protected (auth required)
  // ─────────────────────────────────────────────
  {
    path: 'auth-redirect',
    component: AuthRedirectComponent,
  },
  {
    path: 'characters',
    component: CharacterListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'characters/create',
    component: CharacterCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'characters/:id/edit',
    component: CharacterEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'characters/:id',
    component: CharacterDetailComponent,
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
