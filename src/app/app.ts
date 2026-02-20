import { 
  Component, 
  inject,
  signal,
  ChangeDetectionStrategy
 } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { AuthService } from './auth/auth';
import { FooterComponent } from './shared/footer/footer';
import { LoadingService } from './core/services/loading';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('whizsheet-ui');
  public readonly loadingService = inject(LoadingService);

  constructor(public auth: AuthService) {}
}
