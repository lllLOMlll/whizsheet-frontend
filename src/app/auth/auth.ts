import { Injectable, signal, computed, effect } from '@angular/core';

import { environment } from '../../environments/environment';
import { email } from '@angular/forms/signals';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEY_KEY = 'whizsheet_token';

  private readonly token = signal<string | null>(localStorage.getItem(this.TOKEY_KEY));

  readonly isAuthenticated = computed(() => {
    if (environment.bypassAuth) {
      return true;
    }
    return !!this.token();
  });

  constructor() {
    effect(() => {
      const value = this.token();

      if (value) {
        localStorage.setItem(this.TOKEY_KEY, value);
      } else {
        localStorage.removeItem(this.TOKEY_KEY);
      }
    });
  }

  loginWithEmail(email: string) {
      console.log('[Auth] loginWithEmail:', email);

      // Temporaire - sera remplacé par appel HTTP API
      const fakeJwt = 'FAKE_JWT_FROM_API';
      this.token.set(fakeJwt);
    }

    loginWithGoogle() {
      const url = `${environment.apiBaseUrl}/auth/google/login`;
      window.location.href = url;
    }

    logout() {
      this.token.set(null);
    }

    getToken() {
      return this.token();
    }

}
