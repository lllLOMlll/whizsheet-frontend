import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CharacterLayout } from '../layout/character-layout/character-layout';

import { CharacterStore } from '../core/stores/character-store';
import { Skill, SkillsService, SkillType } from '../core/services/skills';
import { ValueDisplayCard } from '../shared/value-display-card/value-display-card';

@Component({
  selector: 'app-character-skills',
  imports: [CharacterLayout, ValueDisplayCard],
  templateUrl: './character-skills.html',
  styleUrl: './character-skills.css',
})
export class CharacterSkillsComponent {
  readonly characterStore = inject(CharacterStore);
  readonly skillsService = inject(SkillsService);
  private route = inject(ActivatedRoute);

  // ngOnInit() {
  //   const id = Number(this.route.snapshot.paramMap.get('id'));
  // }

  isModalOpen = signal(false);
  //title = signal(SkillType);
  title = 'Skill';
  selectedSkill = signal<Skill | null>(null);

  formatSkillName(skillType: string): string {
    return skillType.replace(/([A-Z])/g, ' $1').trim();
  }

  openModal(skillType: string) {
    const skill = this.characterStore.skills()?.find((s) => s.type === skillType);
    if (skill) {
      // Logique pour ouvrir ta modal avec la skill sélectionnée
    }
  }
}
