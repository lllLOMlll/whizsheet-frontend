import { Component, Input, OnInit, inject, Signal, signal } from '@angular/core';
import { CharacterLayout } from '../../layout/character-layout/character-layout';
import { ItemSectionComponent } from '../../shared/item-section/item-section';
import { WeaponSectionComponent } from '../../shared/weapon-section/weapon-section';
import { MagicItemSectionComponent } from '../../shared/magic-item-section/magic-item-section';
import { WeaponService } from '../../core/services/weapon';
import { CharacterStore } from '../../core/stores/character-store';
import { Weapon } from '../../core/models/weapon';
import { getInitialWeapon } from '../../core/models/weapon';
import { form } from '@angular/forms/signals';
import { submit } from '@angular/forms/signals';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-edit-weapon',
  imports: [
    CharacterLayout,
    ItemSectionComponent,
    WeaponSectionComponent,
    MagicItemSectionComponent,
  ],
  templateUrl: './edit-weapon.html',
  styleUrl: './edit-weapon.css',
})
export class EditWeaponComponent {
  @Input() weaponId?: string;

  weaponService = inject(WeaponService);
  characterStore = inject(CharacterStore);
  toastService = inject(ToastService);

  readonly weaponModel = signal<Weapon>(getInitialWeapon());
  isMagic = signal(false);

  weaponForm = form(this.weaponModel);

  ngOnInit() {
    const characterId = this.characterStore.character()?.id;

    if (characterId && this.weaponId) {
      this.weaponService.getWeaponById(characterId, this.weaponId).subscribe((weapon) => {
        this.weaponModel.set(weapon);
        console.log("Checking if it's a magic item!!!");
        if (weapon.magicItem) {
          console.log('This is a magic item!!!');
          this.isMagic.set(true);
        }
      });
    } else {
      console.error(`Problem loading weapon with id ${this.weaponId}`);
    }
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
          //this.navigateToCharacterDetail();
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
