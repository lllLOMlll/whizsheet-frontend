import { Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-edit-weapon',
  imports: [],
  templateUrl: './edit-weapon.html',
  styleUrl: './edit-weapon.css',
})
export class EditWeaponComponent {
  @Input() weaponId?: string;
}
