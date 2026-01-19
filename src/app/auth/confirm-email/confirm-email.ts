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
      await firstValueFrom(
        this.http.get(`${environment.apiBaseUrl}/auth/confirm-email`, {
          params: { userId, token },
        })
      );

      this.status.set('success');

      setTimeout(() => {
        this.router.navigate(['/email-confirmed']);
      }, 1500);
    } catch {
      this.status.set('error');
    }
  }
}
