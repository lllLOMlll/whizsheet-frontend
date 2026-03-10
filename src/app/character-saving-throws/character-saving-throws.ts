import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ValueDisplayCard } from '../shared/value-display-card/value-display-card';
import { CharacterStore } from '../core/stores/character-store';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { BooleanEditModal } from '../shared/boolean-edit-modal/boolean-edit-modal';
import { SavingThrow, SavingThrowsProficient } from '../core/services/saving-throws';

@Component({
  selector: 'app-character-saving-throws',
  standalone: true,
  imports: [ValueDisplayCard, CharacterLayout, BooleanEditModal],
  templateUrl: './character-saving-throws.html',
  styleUrl: './character-saving-throws.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterSavingThrowsComponent {
  readonly characterStore = inject(CharacterStore);

  isModalOpen = signal(false);
  selectedSavingThrow = signal<SavingThrow | null>(null);
  label = signal<string>('');
  isSelectedSavingThrowProficient = signal<boolean>(false);

  /**
   * Ouvre la modale en utilisant l'objet directement issu du tableau
   */
  openModal(st: SavingThrow) {
    this.selectedSavingThrow.set(st);
    this.label.set(st.savingThrowType);
    this.isSelectedSavingThrowProficient.set(st.isProficient);
    this.isModalOpen.set(true);
  }

  onSave(isProficient: boolean) {
    const current = this.selectedSavingThrow();
    if (!current) return;

    const updateData: SavingThrowsProficient[] = [
      {
        SavingThrowType: current.savingThrowType,
        isProficient: isProficient,
      },
    ];

    this.characterStore.updateSavingThrow(updateData);
    this.isModalOpen.set(false);
  }
}