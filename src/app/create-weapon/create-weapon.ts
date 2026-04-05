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
import { form, Field, submit } from '@angular/forms/signals';
import { ItemRarityType } from '../core/models/item';
import { event } from '@ngrx/signals/events';
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
  // isMagicCheckbox = document.getElementById("is-magic-item") as HTMLInputElement;
  // isMagic = this.isMagicCheckbox;

  readonly Number = Number;

  // Je fais ceci car un enum n'est pas un tableau. Dans le html, si je veux itérer avec le @for, je dois convertir mon enum en tableau
  readonly attackTypeOption = Object.values(AttackType).filter(
    (value) => typeof value === 'number',
  ) as AttackType[];
  readonly AttackType = AttackType;

  readonly rangeTypeOption = Object.values(RangeType).filter(
    (value) => typeof value === 'number',
  ) as RangeType[];
  readonly RangeLabel = RangeLabel;

  readonly rarityOption = Object.values(ItemRarityType).filter(
    (value) => typeof value === 'number',
  ) as ItemRarityType[];
  readonly ItemRarityType = ItemRarityType;

  readonly damageTypeOption = Object.values(DamageType).filter(
    (value) => typeof value === 'number', 
  ) as DamageType[];
  readonly DamageType = DamageType;


  readonly bonusAttackRollTypeOption = Object.values(BonusAttackRollType).filter(
    (value) => typeof value === 'number',
  ) as BonusAttackRollType[];
  readonly BonusAttackRollLabel = BonusAttackRollLabel;
  
  readonly damageDiceTypeOption = Object.values(DamageDiceType).filter(
    (value) => typeof value === 'number',
  ) as DamageDiceType[];
  readonly DamageDiceLabel = DamageDiceLabel;


  readonly weaponModel = signal<Weapon>({
    id: '',
    name: '',
    description: '',
    itemRarity: ItemRarityType.Common as ItemRarityType,
    value: 0,
    weight: 0,
    isEquipped: false,
    isAttuned: false,
    quantity: 1,
    magicItem: {
      id: '',
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
