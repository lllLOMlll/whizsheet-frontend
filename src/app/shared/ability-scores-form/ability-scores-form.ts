import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-ability-scores-form',
  imports: [FormField],
  templateUrl: './ability-scores-form.html',
  styleUrl: './ability-scores-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilityScoresFormComponent {
  @Input({ required: true })
  form!: {
    strength: () => any;
    dexterity: () => any;
    constitution: () => any;
    intelligence: () => any;
    wisdom: () => any;
    charisma: () => any;
  };

}
