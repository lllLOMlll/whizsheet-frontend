import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, forkJoin, filter, catchError, of } from 'rxjs';

import { CharacterService, Character } from '../services/character';
import { CharacterClassService, CharacterClassData } from '../services/character-class';
import { AbilityScoresService, AbilityScores } from '../services/ability-scores';
import { HitPointsService, HitPointsData } from '../services/hit-points';
import { SkillsService, Skill } from '../services/skills';
import { SavingThrow, SavingThrowsService, SavingThrowsProficient } from '../services/saving-throws';
import { CharacterWeapon, Weapon } from '../models/weapon';
import { WeaponService } from '../services/weapon';

export interface CharacterState {
  character: Character | null;
  abilities: AbilityScores | null;
  savingThrows: SavingThrow[]; // Initialisé en tableau vide pour éviter les null checks constants
  classes: CharacterClassData[];
  hitPoints: HitPointsData | null;
  skills: Skill[];
  weapons: Weapon[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CharacterState = {
  character: null,
  abilities: null,
  savingThrows: [],
  classes: [],
  hitPoints: null,
  skills: [],
  weapons: [],
  isLoading: false,
  error: null,
};

export const CharacterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ classes, skills, savingThrows }) => ({
    sortedClasses: computed(() => {
      const data = classes();
      return [...data].sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        const nameA = a.customClassName ?? a.classType ?? '';
        const nameB = b.customClassName ?? b.classType ?? '';
        return nameA.localeCompare(nameB);
      });
    }),
    sortedSkills: computed(() => {
      const data = skills();
      if (!data || !Array.isArray(data)) return [];
      return [...data].sort((a, b) => a.type.localeCompare(b.type));
    })
  })),

  withMethods(
    (
      store,
      charService = inject(CharacterService),
      abilityService = inject(AbilityScoresService),
      classService = inject(CharacterClassService),
      hitPointsService = inject(HitPointsService),
      skillsService = inject(SkillsService),
      savingThrowsService = inject(SavingThrowsService),
      weaponService = inject(WeaponService)
    ) => ({
      
      loadCharacterData: rxMethod<number>(
        pipe(
          filter((id) => id > 0),
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((id) =>
            forkJoin({
              character: charService.getById(id),
              abilityResponse: abilityService.get(id),
              classes: classService.get(id),
              hitPoints: hitPointsService.get(id),
              // Renvoie SavingThrow[] grâce au .pipe(map) dans le service
              savingThrowsList: savingThrowsService.get(id),
              weapons: weaponService.getCharacterWeapons(id), 
            }).pipe(
              tap({
                next: (data) =>
                  patchState(store, {
                    character: data.character,
                    classes: data.classes,
                    hitPoints: data.hitPoints,
                    abilities: data.abilityResponse.abilities,
                    skills: data.abilityResponse.skills,
                    savingThrows: data.savingThrowsList, 
                    weapons: data.weapons,
                    isLoading: false,
                  }),
                error: (err) => {
                  console.error(err);
                  patchState(store, { isLoading: false, error: 'Load failed' });
                },
              }),
              catchError(() => of(null))
            )
          )
        )
      ),

      updateAbilities: rxMethod<AbilityScores>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((newData) => {
            const id = store.character()?.id;
            if (!id) return of(null);
            return abilityService.update(id, newData).pipe(
              // On recharge les saving throws car les modificateurs dépendent des scores d'habilités
              switchMap((res) => 
                savingThrowsService.get(id).pipe(
                  tap(stList => patchState(store, { 
                    abilities: res.abilities, 
                    skills: res.skills,
                    savingThrows: stList,
                    isLoading: false 
                  }))
                )
              ),
              catchError(() => {
                patchState(store, { isLoading: false, error: 'Update failed' });
                return of(null);
              })
            );
          })
        )
      ),

      updateSkills: rxMethod<Skill[]>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((updatedSkills) => {
            const id = store.character()?.id;
            if (!id) return of(null);
            return skillsService.update(id, updatedSkills).pipe(
              tap((res) => patchState(store, { skills: res, isLoading: false })),
              catchError(() => {
                patchState(store, { isLoading: false });
                return of(null);
              })
            );
          })
        )
      ),

      updateSavingThrow: rxMethod<SavingThrowsProficient[]>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((newData) => {
            const id = store.character()?.id;
            if (!id) return of(null);

            return savingThrowsService.put(id, newData).pipe(
              tap((updatedList) => {
                // updatedList est un SavingThrow[] (grâce au map dans le service)
                patchState(store, {
                  savingThrows: updatedList,
                  isLoading: false,
                });
              }),
              catchError((err) => {
                console.error(err);
                patchState(store, { isLoading: false, error: 'Update failed' });
                return of(null);
              })
            );
          })
        )
      ),

      updateHp: rxMethod<HitPointsData>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((data) => {
            const id = store.character()?.id;
            if (!id) return of(null);
            return hitPointsService.update(id, data).pipe(
              tap((res) => patchState(store, { hitPoints: res, isLoading: false })),
              catchError(() => of(null))
            );
          })
        )
      ),

      removeWeaponFromStore(weaponId: string): void {
        patchState(store, {
          weapons: store.weapons().filter((w) => w.id !== weaponId),
        });
      },

      clear: () => patchState(store, initialState),
    })
  )
);