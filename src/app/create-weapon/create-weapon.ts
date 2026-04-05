import { Component, inject, signal, computed } from '@angular/core';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { WeaponService } from '../core/services/weapon';
import {
  AttackType,
  RangeType,
  RangeLabel,
  BonusAttackRollType,
  BonusAttackRollLabel,
  DamageDiceType,
  DamageDiceLabel,
  DamageType,
  Weapon,
} from '../core/models/weapon';
import { MagicItemEffect, ItemEffectType } from '../core/models/magic-item';
import { ItemRarityType } from '../core/models/item';
import { AbilityScoreType } from '../core/models/ability-score';
import { SavingThrowType } from '../core/models/saving-throw';
import { SkillType } from '../core/models/skill';
import { form, Field, submit } from '@angular/forms/signals';
import { CharacterStore } from '../core/stores/character-store';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-weapon',
  imports: [CharacterLayout, Field, FormsModule],
  templateUrl: './create-weapon.html',
  styleUrl: './create-weapon.css',
})
export class CreateWeaponComponent {
  readonly weaponService = inject(WeaponService);
  readonly characterStore = inject(CharacterStore);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isMagic = signal(false);

  readonly Number = Number;

  // Je fais ceci car un enum n'est pas un tableau. Dans le html, si je veux itérer avec le @for, je dois convertir mon enum en tableau
  readonly attackTypeOptions = Object.values(AttackType).filter(
    (value) => typeof value === 'number',
  ) as AttackType[];
  readonly AttackType = AttackType;

  readonly rangeTypeOptions = Object.values(RangeType).filter(
    (value) => typeof value === 'number',
  ) as RangeType[];
  readonly RangeLabel = RangeLabel;

  readonly rarityOptions = Object.values(ItemRarityType).filter(
    (value) => typeof value === 'number',
  ) as ItemRarityType[];
  readonly ItemRarityType = ItemRarityType;

  readonly damageTypeOptions = Object.values(DamageType).filter(
    (value) => typeof value === 'number',
  ) as DamageType[];
  readonly DamageType = DamageType;

  readonly bonusAttackRollTypeOptions = Object.values(BonusAttackRollType).filter(
    (value) => typeof value === 'number',
  ) as BonusAttackRollType[];
  readonly BonusAttackRollLabel = BonusAttackRollLabel;

  readonly damageDiceTypeOptions = Object.values(DamageDiceType).filter(
    (value) => typeof value === 'number',
  ) as DamageDiceType[];
  readonly DamageDiceLabel = DamageDiceLabel;

  readonly ItemEffectType = ItemEffectType;
  readonly effectTypeOptions = Object.values(ItemEffectType).filter(
    (value) => typeof value === 'number',
  );

  readonly weaponModel = signal<Weapon>({
    id: undefined,
    name: '',
    description: '',
    itemRarity: ItemRarityType.Common as ItemRarityType,
    value: 0,
    weight: 0,
    isEquipped: false,
    isAttuned: false,
    quantity: 1,
    magicItem: {
      id: undefined,
      requiresAttunement: false,
      magicEffectDescription: '',
      magicEffectMechanics: '',
      totalCharges: 0,
      chargesRemaining: 0,
      magicRechargeRate: '',
      effects: [],
    },
    attackType: AttackType.Melee,
    bonusAttackRollType: BonusAttackRollType.None,
    damageDiceType: DamageDiceType.D4_1,
    damageType: DamageType.Slashing,
    rangeType: RangeType.R0,
    isLight: false,
    isFinesse: false,
    isThrown: false,
    isVersatile: false,
    isAmmunition: false,
    isHeavy: false,
    isReach: false,
    isTwoHanded: false,
    isLoading: false,
    isSpecial: false,
  });

  weaponForm = form(this.weaponModel);

  readonly isRange = computed(() => {
    return this.Number(this.weaponModel().attackType) === AttackType.Range;
  });

  addMagicEffect() {
    const currentWeapon = this.weaponModel();
    const newEffect: MagicItemEffect = {
      id: undefined,
      effectType: ItemEffectType.AbilityScore,
      abilityScore: AbilityScoreType.Strength,
      savingThrow: SavingThrowType.Strength,
      skill: SkillType.Acrobatics,
      modifier: 0,
    };

    this.weaponModel.set({
      ...currentWeapon,
      magicItem: {
        ...currentWeapon.magicItem!,
        effects: [...(currentWeapon.magicItem?.effects || []), newEffect],
      },
    });
  }

  removeMagicEffect(index: number) {
    const currentWeapon = this.weaponModel();

    if (!currentWeapon.magicItem) return;

    const updatedEffects = [...currentWeapon.magicItem.effects];
    updatedEffects.splice(index, 1);

    this.weaponModel.set({
      ...currentWeapon,
      magicItem: {
        ...currentWeapon.magicItem,
        effects: updatedEffects,
      },
    });
  }

  navigateToCharacterDetail(): void {
    this.router.navigate(['/characters', this.characterStore.character()?.id]);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.weaponForm, async () => {
      const characterId = this.characterStore.character()?.id ?? 0;
      // utilisation de { ...this.weaponModel() }. Cela crée une copie superficielle. C'est important pour ne pas modifier directement l'état de votre signal weaponModel pendant que vous préparez l'envoi HTTP.
      const weaponData = { ...this.weaponModel() };

      if (weaponData.name === '') {
        this.toastService.show('Error, weapon name is required', 'error');
        return;
      }

      if (!this.isMagic()) {
        delete weaponData.magicItem;
      }

      this.weaponService.createWeapon(characterId, weaponData).subscribe({
        next: (response) => {
          // Succès : exécuté quand le serveur répond 200/201
          // Ici, vous pourriez rediriger l'utilisateur ou afficher un message de succès
          this.toastService.show(`Weapon "${weaponData.name}" was created successfully.`);
          this.navigateToCharacterDetail();
        },
        error: (err) => {
          console.error('Error while creating a weapon', err);
          this.toastService.show(`Error while creating ${weaponData.name}`, 'error');
        },
        complete: () => {
          // Optionnel : exécuté quand tout est fini, quoi qu'il arrive
          console.log('Flux terminé.');
        },
      });
    });
  }
}
