import {
  Component,
  signal,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
} from '@angular/core';

import { form, Field, required, email, minLength, submit } from '@angular/forms/signals';

import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../auth';


interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [Field, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error = signal<string | null>(null);

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (field) => {
    required(field.email, { message: 'Email is requird' });
    email(field.email, { message: 'Invalid email address' });

    required(field.password, { message: 'Password is required' });
    minLength(field.password, 8, { message: 'Minimum 8 characters' });
  });

  constructor() {
    // 🔐 GOOGLE LOGIN RETURN
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.auth.storeToken(token);
      this.router.navigate(['/auth-redirect']);
    }
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);

    submit(this.loginForm, async () => {
      try {
        const { email, password } = this.loginModel();

        await this.auth.login(email, password);

        await this.router.navigate(['/auth-redirect']);
      } catch (err: any) {
        if (err?.error === 'Email not confirmed') {
          await this.router.navigate(['/check-email']);
          return;
        }

        this.error.set('Invalid email or password');
      }
    });
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle();
  }
}
