import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { CharacterClassType, DND_CLASSES } from '../../core/services/character-class';

@Component({
  selector: 'app-character-class-form',
  standalone: true,
  imports: [Field],
  templateUrl: './character-class-form.html',
  styleUrl: './character-class-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterClassFormComponent {
  @Input({ required: true })
  forms!: any[]; // FormGroupSignal<CharacterClassFormModel>[]

  @Input({ required: true })
  isTotalLevelValid!: boolean;

  @Input({ required: true })
  isDuplicateClass!: boolean;

  @Input({ required: true })
  isDuplicatedCustomClass!: boolean;

  @Output()
  addClass = new EventEmitter<void>();

  @Output()
  removeClass = new EventEmitter<void>();

  readonly dndClasses = DND_CLASSES;
  readonly CharacterClassType = CharacterClassType;
}
