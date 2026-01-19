import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

import {
  form,
  Field,
  required,
  email,
  minLength,
  submit,
} from '@angular/forms/signals';

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
      const { email, password, confirmPassword } =
        this.registerModel();

      if (password !== confirmPassword) {
        this.error.set('Passwords do not match');
        return;
      }

      try {
        await firstValueFrom(
          this.http.post(
            `${environment.apiBaseUrl}/auth/register`,
            { email, password }
          )
        );

        await this.router.navigate(['/check-email']);
      } catch (err: any) {
        this.error.set(
          err?.error?.[0]?.description ??
          'Registration failed'
        );
      }
    });
  }
}
