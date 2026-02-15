import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ability-score-card',
  imports: [],
  templateUrl: './ability-score-card.html',
  styleUrl: './ability-score-card.css',
})
export class AbilityScoreCard {
  label = input.required<string>();
  value = input.required<number>();
  edit = output<void>();

  calculateModifier(score: number) : string {
    const mod = Math.floor((score -10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }
}
