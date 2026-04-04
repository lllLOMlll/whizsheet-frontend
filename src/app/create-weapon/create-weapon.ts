import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { WeaponService } from '../core/services/weapon';
import {
  AttackType,
  BonusAttackRollType,
  DamageDiceType,
  DamageType,
  RangeType,
  Weapon,
} from '../core/models/weapon';
import { form, Field, submit } from '@angular/forms/signals';
import { ItemRarityType } from '../core/models/item';
import { event } from '@ngrx/signals/events';
import { CharacterStore } from '../core/stores/character-store';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast';

@Component({
  selector: 'app-create-weapon',
  imports: [CharacterLayout, Field],
  templateUrl: './create-weapon.html',
  styleUrl: './create-weapon.css',
})
export class CreateWeaponComponent {
  readonly weaponService = inject(WeaponService);
  readonly characterStore = inject(CharacterStore);
  private router = inject(Router);
  private toastService = inject(ToastService);

  readonly weaponModel = signal<Weapon>({
    id: '',
    name: '',
    description: '',
    itemRarity: ItemRarityType.Common,
    value: 0,
    weight: 0,
    isEquipped: false,
    isAttuned: false,
    quantity: 0,
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

  navigateToCharacterDetail(): void {
    this.router.navigate([
      '/characters',
      this.characterStore.character()?.id,
    ])
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.weaponForm, async () => {
      const characterId = this.characterStore.character()?.id ?? 0;
      // utilisation de { ...this.weaponModel() }. Cela crée une copie superficielle. C'est important pour ne pas modifier directement l'état de votre signal weaponModel pendant que vous préparez l'envoi HTTP.
      const weaponData = {...this.weaponModel()};

      const weaponName = weaponData.name

      if (weaponName === "") {
        this.toastService.show("Error, no weapon name", "error");
        return;
      }

      if (weaponData.itemRarity === ItemRarityType.Common) {
        delete weaponData.magicItem;
      }

      this.weaponService.createWeapon(characterId, weaponData).subscribe({
        next: (response) => {
          // Succès : exécuté quand le serveur répond 200/201
          // Ici, vous pourriez rediriger l'utilisateur ou afficher un message de succès
          this.toastService.show(`Weapon "${weaponData.name}" was created successfully.`)
          this.navigateToCharacterDetail();
        },
        error: (err) => {
          console.error('Error while creating a weapon', err);
          this.toastService.show(`Error while creating ${weaponData.name}`);
        },
        complete: () => {
          // Optionnel : exécuté quand tout est fini, quoi qu'il arrive
          console.log('Flux terminé.');
        },
      });
    });
  }
}
