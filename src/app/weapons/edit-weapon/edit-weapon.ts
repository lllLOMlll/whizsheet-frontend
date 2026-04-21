import { Component, Input, OnInit, inject, Signal, signal} from '@angular/core';
import { CharacterLayout } from '../../layout/character-layout/character-layout';
import { ItemSectionComponent } from '../../shared/item-section/item-section';
import { WeaponSectionComponent } from '../../shared/weapon-section/weapon-section';
import { WeaponService } from '../../core/services/weapon';
import { CharacterStore } from '../../core/stores/character-store';
import { Weapon } from '../../core/models/weapon';
import { getInitialWeapon } from '../../core/models/weapon';
import { form } from '@angular/forms/signals';


@Component({
  selector: 'app-edit-weapon',
  imports: [CharacterLayout, ItemSectionComponent, WeaponSectionComponent],
  templateUrl: './edit-weapon.html',
  styleUrl: './edit-weapon.css',
})
export class EditWeaponComponent {
  @Input() weaponId?: string;

  weaponService = inject(WeaponService);
  characterStore = inject(CharacterStore);

  readonly weaponModel = signal<Weapon>(getInitialWeapon());

  weaponForm = form(this.weaponModel);

  ngOnInit() {
    const characterId = this.characterStore.character()?.id;

    if (characterId && this.weaponId) {
      this.weaponService.getWeaponById(characterId, this.weaponId).subscribe(weapon => {
        this.weaponModel.set(weapon);
      });
    } else  {
      console.error(`Problem loading weapon with id ${this.weaponId}`);
    }
  }
}
