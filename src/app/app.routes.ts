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
import { CharacterAbilityScores } from './character-ability-scores/character-ability-scores';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth-redirect', component: AuthRedirectComponent},
  { path: 'check-email', component: CheckEmailComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'email-confirmed', component: EmailConfirmedComponent },
  { path: 'resend-confirmation', component: ResendConfirmationComponent },

  // Protected
  {
    path: 'characters',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: CharacterListComponent,
      },
      {
        path: 'create',
        component: CharacterCreateComponent,
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: CharacterDetailComponent,
          },
          {
            path: 'edit',
            component: CharacterEditComponent,
          },
          {
            path: 'ability-scores',
            component: CharacterAbilityScores,
          },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
