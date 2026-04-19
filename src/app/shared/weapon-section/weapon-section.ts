import { Component, input, computed } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import {
  AttackType,
  BonusAttackRollLabel,
  BonusAttackRollType,
  DamageDiceLabel,
  DamageDiceType,
  DamageType,
  RangeLabel,
  RangeType,
} from '../../core/models/weapon';
import { ItemEffectType } from '../../core/models/magic-item';
import { getEnumOptions } from '../../core/utils/enum-util';

@Component({
  selector: 'app-weapon-section',
  imports: [Field, FormsModule],
  templateUrl: './weapon-section.html',
  styleUrl: './weapon-section.css',
})
export class WeaponSectionComponent {
  form = input.required<any>();

  readonly Number = Number;
  readonly isRange = computed(() => {
    const attackTypeValue = this.form().attackType.value;
    return this.Number(attackTypeValue) === AttackType.Range;
  });

  protected readonly attackTypeOptions = getEnumOptions<AttackType>(AttackType);
  protected readonly itemAttackType = AttackType;

  protected readonly rangeTypeOptions = getEnumOptions<RangeType>(RangeType);
  protected readonly rangeLabel = RangeLabel;

  protected readonly damageTypeOptions = getEnumOptions<DamageType>(DamageType);
  protected readonly itemDamageType = DamageType;

  protected readonly bonusAttackRollTypeOptions = getEnumOptions<BonusAttackRollType>(BonusAttackRollType);
  protected readonly bonusAttackRollLabel = BonusAttackRollLabel;

  protected readonly damageDiceTypeOptions = getEnumOptions<DamageDiceType>(DamageDiceType);
  protected readonly damageDiceLabel = DamageDiceLabel;

  protected readonly effectTypeOptions = getEnumOptions<ItemEffectType>(ItemEffectType);
  protected readonly itemEffectType = ItemEffectType;
}
