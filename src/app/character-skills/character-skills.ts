import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CharacterLayout } from '../layout/character-layout/character-layout';

import { CharacterStore } from '../core/stores/character-store';
import { Skill, SkillsService, SkillType } from '../core/services/skills';
import { ValueDisplayCard } from '../shared/value-display-card/value-display-card';
import { BooleanEditModal } from '../shared/boolean-edit-modal/boolean-edit-modal';

@Component({
  selector: 'app-character-skills',
  imports: [CharacterLayout, ValueDisplayCard, BooleanEditModal],
  templateUrl: './character-skills.html',
  styleUrl: './character-skills.css',
})
export class CharacterSkillsComponent {
  readonly characterStore = inject(CharacterStore);
  readonly skillsService = inject(SkillsService);
  private route = inject(ActivatedRoute);

  isModalOpen = signal(false);
  selectedSkill = signal<Skill | null>(null);

  formatSkillName(skillType: string): string {
    return skillType.replace(/([A-Z])/g, ' $1').trim();
  }

  openModal(skillType: string) {
    const skill = this.characterStore.skills()?.find((s) => s.type === skillType);
    if (skill) {
      this.selectedSkill.set(skill);
      this.isModalOpen.set(true);
    }
  }
  onSaveSkill(isProficient: any) {
    const skill = this.selectedSkill();
    if (skill) {
      // On crée une copie du tableau des skills avec la modification
      const updatedSkills = this.characterStore
        .skills()
        ?.map((s) => (s.type === skill.type ? { ...s, isProficient: !!isProficient } : s));

      if (updatedSkills) {
        this.characterStore.updateSkills(updatedSkills);
      }
    }
    this.isModalOpen.set(false);
  }
}
