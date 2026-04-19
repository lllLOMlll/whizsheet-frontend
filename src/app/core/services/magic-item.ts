import { Injectable, WritableSignal } from '@angular/core';
import { MagicItemEffect, ItemEffectType } from '../models/magic-item';
import { AbilityScoreType } from '../models/ability-score';
import { SavingThrowType } from '../models/saving-throw';
import { SkillType } from '../models/skill';


@Injectable({
  providedIn: 'root',
})
export class MagicItemService {
  createDefaultEffect(): MagicItemEffect {
    return {
      id: undefined,
      effectType: ItemEffectType.AbilityScore,
      abilityScore: AbilityScoreType.Strength,
      savingThrow: SavingThrowType.Strength,
      skill: SkillType.Acrobatics,
      modifier: 0,
    };
  }

  // Cette méthode peut être appelée depuis n'importe quel composant
  addEffectToModel(modelSignal: WritableSignal<any>) {
    const current = modelSignal();
    const newEffect = this.createDefaultEffect();
    
    modelSignal.set({
      ...current,
      magicItem: {
        ...current.magicItem,
        effects: [...(current.magicItem?.effects || []), newEffect]
      }
    });
  }
}
