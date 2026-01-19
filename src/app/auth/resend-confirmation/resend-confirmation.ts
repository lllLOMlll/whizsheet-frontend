import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

import { form, Field, required, email, submit } from '@angular/forms/signals';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface ResendData {
  email: string;
}

@Component({
  selector: 'app-resend-confirmation',
  imports: [Field],
  templateUrl: './resend-confirmation.html',
  styleUrl: './resend-confirmation.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResendConfirmationComponent {
  private http = inject(HttpClient);

  success = signal(false);

  model = signal<ResendData>({
    email: '',
  });

  resendForm = form(this.model, (field) => {
    required(field.email, { message: 'Email is required' });
    email(field.email, { message: 'Invalid email address' });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    submit(this.resendForm, async () => {
      await firstValueFrom(
        this.http.post(
          `${environment.apiBaseUrl}/auth/resend-confirmation`,
          { email: this.model().email }
        )
      );

      this.success.set(true);
    });
  }
}
