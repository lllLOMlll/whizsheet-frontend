import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-value-display-card',
  imports: [],
  templateUrl: './value-display-card.html',
  styleUrl: './value-display-card.css',
})
export class ValueDisplayCard {
  label = input.required<string>();
  isLabelUnderline = input<boolean>(false);
  value = input.required<number>();
  edit = output<void>();
}
