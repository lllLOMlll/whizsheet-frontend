import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ValueDisplayCard } from '../shared/value-display-card/value-display-card';
import { CharacterStore } from '../core/stores/character-store';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { BooleanEditModal } from '../shared/boolean-edit-modal/boolean-edit-modal';
import { SavingThrowsService, SavingThrowsType, SavingThrow, SavingThrowsProficient, SavingThrows } from '../core/services/saving-throws';

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
  
  // CRITIQUE : On expose l'enum pour le template
  public readonly SavingThrowsType = SavingThrowsType;

  isModalOpen = signal(false);
  selectedSavingThrow = signal<SavingThrow | null>(null);
  label = signal<string>('');

  // Signal calculé pour la modale
  isSelectedSavingThrowProficient = signal<boolean>(false);

 getSavingThrow(type: SavingThrowsType): SavingThrow | undefined {
  return this.characterStore.savingThrow()?.find(s => s.SavingThrowType === type);
 }

  // Ouvre la modale à partir d'un type précis
  openModalByEnum(type: SavingThrowsType) {
    const st = this.getSavingThrow(type);
    if (st) {
      this.selectedSavingThrow.set(st);
      this.label.set(st.SavingThrowType.charAt(0).toUpperCase() + st.SavingThrowType.slice(1)); // Capitalize
      this.isSelectedSavingThrowProficient.set(st.isProficient);
      this.isModalOpen.set(true);
    }
  }

  onSave(isProficient: boolean) {
    const current = this.selectedSavingThrow();
    if (!current) return;

    // Préparation de la donnée pour le Store (SavingThrowsProficient[])
    const updateData: SavingThrowsProficient[] = [
      {
        SavingThrowType: current.SavingThrowType,
        isProficient: isProficient,
      },
    ];

    // Mise à jour via le store
    this.characterStore.updateSavingThrow(updateData);
    this.isModalOpen.set(false);
  }
}