import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

import { form, Field, required, email, minLength, submit } from '@angular/forms/signals';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  imports: [Field],
  templateUrl: './register.html',
  styleUrl: './register.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  showPasswordHint = signal(false);

  error = signal<string | null>(null);

  registerModel = signal<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (field) => {
    required(field.email, { message: 'Email is required' });
    email(field.email, { message: 'Invalid email address' });

    required(field.password, { message: 'Password is required' });
    minLength(field.password, 8, {
      message: 'Minimum 8 characters',
    });

    required(field.confirmPassword, {
      message: 'Please confirm password',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);

submit(this.registerForm, async () => {
  console.log('--- DÉBUT DE LA SOUMISSION ---');
  const { email, password, confirmPassword } = this.registerModel();
  
  console.log('Données du modèle récupérées :', { email, password, confirmPassword });

  if (password !== confirmPassword) {
    console.warn('ÉCHEC : Les mots de passe ne correspondent pas.');
    this.error.set('Passwords do not match');
    return;
  }

  try {
    const url = `${environment.apiBaseUrl}/auth/register`;
    console.log(`Tentative de POST sur : ${url}`);

    const response = await firstValueFrom(
      this.http.post(url, { email, password })
    );

    console.log('SUCCÈS API : Réponse reçue du serveur :', response);

    console.log('Tentative de navigation vers /check-email...');
    const navigationResult = await this.router.navigate(['/check-email']);
    
    console.log('Navigation terminée. Succès ?', navigationResult);
    
    if (!navigationResult) {
      console.error('La navigation a échoué. Vérifiez vos routes Angular (App Routes).');
    }

  } catch (err: any) {
    console.error('ERREUR CAPTURÉE lors de l\'appel API :', err);

    // Analyse détaillée de l'erreur
    if (err.status === 0) {
      console.error('Erreur de réseau (CORS ou serveur non lancé).');
    } else {
      console.log(`Status code : ${err.status}`);
      console.log('Corps de l\'erreur (err.error) :', err.error);
    }

    if (Array.isArray(err?.error)) {
      const messages = err.error.map((e: any) => e.description).join(' ');
      console.log('Erreurs de validation Identity détectées :', messages);
      this.error.set(messages);
    } else {
      const fallbackMsg = err?.error?.title || 'Registration failed';
      this.error.set(fallbackMsg);
    }
  } finally {
    console.log('--- FIN DU PROCESSUS ---');
  }
});
  }

  onConfirmPassowrdBlur(): void {
    const { password } = this.registerModel();

    if (password.length < 8) {
      this.showPasswordHint.set(true);
    } else {
      this.showPasswordHint.set(false);
    }
  }

}
