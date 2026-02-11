import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CharacterClassModel, CharacterClassType, DND_CLASSES } from '../../core/services/character-class';

@Component({
  selector: 'app-character-class-item',
  standalone: true,
  templateUrl: './character-class-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterClassItemComponent {
  model = input.required<CharacterClassModel>();

  updated = output<CharacterClassModel>();
  removed = output<void>();

  readonly classes = DND_CLASSES;
  readonly CharacterClassType = CharacterClassType;

  update(patch: Partial<CharacterClassModel>) {
    this.updated.emit({ ...this.model(), ...patch });
  }

  remove() {
    this.removed.emit();
  }
}
