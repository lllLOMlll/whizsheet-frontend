import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-confirmed',
  imports: [RouterLink],
  templateUrl: './email-confirmed.html',
  styleUrl: './email-confirmed.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmedComponent {

}
