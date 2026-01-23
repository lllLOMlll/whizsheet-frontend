import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Field } from '@angular/forms/signals';

@Component({
  selector: 'app-ability-scores-form',
  imports: [Field],
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
