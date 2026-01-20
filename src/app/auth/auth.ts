import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
}

const TOKEN_KEY = 'whizsheet-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly token = signal<string | null>(
    localStorage.getItem(TOKEN_KEY)
  );

  readonly isAuthenticated = computed(() => !!this.token());

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(
        `${environment.apiBaseUrl}/auth/login`,
        { email, password }
      )
    );

   this.token.set(response.token);
   localStorage.setItem(TOKEN_KEY, response.token); 
  }

  loginWithGoogle(): void {
    window.location.href = `${environment.apiBaseUrl}/auth/google`
  }

  logout(): void {
    this.token.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return this.token();
  }

  storeToken(token: string): void  {
    this.token.set(token);
    localStorage.setItem(TOKEN_KEY, token);
  }

}
