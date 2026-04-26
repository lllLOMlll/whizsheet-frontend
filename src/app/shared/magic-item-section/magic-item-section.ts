import { Component, inject, input, model, WritableSignal } from '@angular/core';
import { getEnumOptions } from '../../core/utils/enum-util';
import { ItemEffectType } from '../../core/models/magic-item';
import { Field } from "@angular/forms/signals";
import { MagicItemService } from '../../core/services/magic-item';
import { AbilityScoreType } from '../../core/models/ability-score';
import { SavingThrowType } from '../../core/models/saving-throw';
import { SkillType } from '../../core/models/skill';

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
  protected readonly abilityScoreOptions = getEnumOptions<AbilityScoreType>(AbilityScoreType);
  protected readonly savingThrowType = SavingThrowType;
  protected readonly savingThrowOptions = getEnumOptions<SavingThrowType>(SavingThrowType);
  protected readonly skillType = SkillType;
  protected readonly skillTypeOptions = getEnumOptions<SkillType>(SkillType);


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
