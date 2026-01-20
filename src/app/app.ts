import { 
  Component, 
  signal,
  ChangeDetectionStrategy
 } from '@angular/core';

import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { AuthService } from './auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('whizsheet-ui');

  constructor(public auth: AuthService) {}
}
