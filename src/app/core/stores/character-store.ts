import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, forkJoin, filter, catchError, of } from 'rxjs';

import { CharacterService, Character } from '../services/character';
import { CharacterClassService, CharacterClassData } from '../services/character-class';
import { AbilityScoresService, AbilityScores } from '../services/ability-scores';
import { HitPointsService, HitPointsData } from '../services/hit-points';
import { SkillsService, Skill } from '../services/skills';
import { SavingThrow, SavingThrowsService, SavingThrowsProficient, SavingThrowsType, SavingThrows } from '../services/saving-throws';

export interface CharacterState {
  character: Character | null;
  abilities: AbilityScores | null;
  savingThrows: SavingThrow[] | null;
  classes: CharacterClassData[];
  hitPoints: HitPointsData | null;
  skills: Skill[] | null;
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
  isLoading: false,
  error: null,
};

/**
 * Transforme l'objet plat (DTO Backend) en tableau SavingThrow[] pour le store
 */
function mapSavingThrowsToTable(st: SavingThrows): SavingThrow[] {
  return [
    { SavingThrowType: SavingThrowsType.strength, isProficient: st.isStrengthProficient, modifier: st.strength },
    { SavingThrowType: SavingThrowsType.dexterity, isProficient: st.isDexterityProficient, modifier: st.dexterity },
    { SavingThrowType: SavingThrowsType.constitution, isProficient: st.isConstitutionProficient, modifier: st.constitution },
    { SavingThrowType: SavingThrowsType.intelligence, isProficient: st.isIntelligenceProficient, modifier: st.intelligence },
    { SavingThrowType: SavingThrowsType.wisdom, isProficient: st.isWisdomProficient, modifier: st.wisdom },
    { SavingThrowType: SavingThrowsType.charisma, isProficient: st.isCharismaProficient, modifier: st.charisma },
  ];
}

export const CharacterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ classes, skills }) => ({
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
    }),
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
    ) => ({
      
      /**
       * Charge toutes les données. 
       * Note: On utilise abilityResponse.savingThrows car c'est lui qui contient les modificateurs calculés.
       */
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
              savingThrows: savingThrowsService.get(id),         
              // On ignore le get de savingThrowsService ici car le abilityService renvoie déjà tout proprement
            }).pipe(
              tap({
                next: (data) =>
                  patchState(store, {
                    character: data.character,
                    classes: data.classes,
                    hitPoints: data.hitPoints,
                    abilities: data.abilityResponse.abilities,
                    skills: data.abilityResponse.skills,
                    // Utilisation de l'objet calculé du Ability Controller
                    //savingThrows: mapSavingThrowsToTable(data.abilityResponse.savingThrows), 
                    savingThrows: data.savingThrows,
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
              tap((response) => {
                patchState(store, {
                  abilities: response.abilities,
                  skills: response.skills,
                  savingThrows: mapSavingThrowsToTable(response.savingThrows),
                  isLoading: false
                });
              }),
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
        tap((response: SavingThrows) => {
          // On transforme la réponse plate de l'API en tableau pour le store
          const updatedTable = mapSavingThrowsToTable(response);
          
          patchState(store, { 
            savingThrows: updatedTable, 
            isLoading: false 
          });
        }),
        catchError((err) => {
          console.error(err);
          patchState(store, { isLoading: false, error: 'Update saving throws failed' });
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

      clear: () => patchState(store, initialState),
    })
  )
);