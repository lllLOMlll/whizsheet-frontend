import { Component, inject, input, model, WritableSignal } from '@angular/core';
import { getEnumOptions } from '../../core/utils/enum-util';
import { ItemEffectType } from '../../core/models/magic-item';
import { Field } from "@angular/forms/signals";
import { MagicItemService } from '../../core/services/magic-item';
import { AbilityScoreType } from '../../core/models/ability-score';

@Component({
  selector: 'app-magic-item-section',
  imports: [Field],
  templateUrl: './magic-item-section.html',
  styleUrl: './magic-item-section.css',
})
export class MagicItemSectionComponent {
  form = input.required<any>();
  model = input.required<WritableSignal<any>>();
  isMagic = model<boolean>(false);

  private magicService = inject(MagicItemService);

  protected readonly itemEffectType = ItemEffectType;
  protected readonly itemEffectTypeOptions = getEnumOptions<ItemEffectType>(ItemEffectType);
  protected readonly abilityScoreType = AbilityScoreType;  
  protected readonly abilityScoreOption = getEnumOptions<AbilityScoreType>(AbilityScoreType);


onMagicToggle(checked: boolean) {
    this.isMagic.set(checked);

    if (checked && !this.model()().magicItem) {
      this.model().update(data => ({
        ...data,
        magicItem: {
          requiresAttunement: false,
          magicEffectDescription: '',
          magicEffectMechanics: '',
          totalCharges: 0,
          chargesRemaining: 0,
          effects: []
        }
      }));
    }
  }

  addMagicEffect() {
    this.magicService.addEffectToModel(this.model());
  }

removeMagicEffect(index: number) {
  const signal = this.model(); 
  const data = signal(); 
  const updatedEffects = [...data.magicItem.effects];
  updatedEffects.splice(index, 1);
  signal.set({
    ...data,
    magicItem: { ...data.magicItem, effects: updatedEffects }
  });
}

}
