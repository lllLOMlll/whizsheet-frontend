import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-confirm-email',
  imports: [],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmailComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  status = signal<'loading' | 'success' | 'error'>('loading');

  async ngOnInit(): Promise<void> {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!userId || !token) {
      this.status.set('error');
      return;
    }

    try {
      const result = await firstValueFrom(
        this.http.get<{ confirmed: boolean }>(`${environment.apiBaseUrl}/auth/confirm-email`, {
          params: { userId, token },
        }),
      );

      if (result.confirmed) {
        this.status.set('success');

        // 🔒 Nettoyer l’URL → plus de token
        history.replaceState(null, '', '/email-confirmed');

        setTimeout(() => {
          this.router.navigate(['/email-confirmed']);
        }, 800);
      } else {
        this.status.set('error');
      }
    } catch {
      // ❌ ne plus afficher "token expired"
      this.status.set('error');
    }
  }
}
