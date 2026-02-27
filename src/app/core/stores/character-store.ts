import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, forkJoin, filter, catchError, of, Observable } from 'rxjs';

import { CharacterService, Character } from '../services/character';
import { CharacterClassService, CharacterClassData } from '../services/character-class';
import { AbilityScoresService, AbilityScores } from '../services/ability-scores';
import { HitPointsService, HitPointsData } from '../services/hit-points';
import { SkillsService, SkillType, Skill } from '../services/skills';

// 1. Définition de l'état
export interface CharacterState {
  character: Character | null;
  abilities: AbilityScores | null;
  classes: CharacterClassData[];
  hitPoints: HitPointsData | null;
  skills: Skill[] | null;
  isLoading: boolean;
  error: string | null;
}

// 2. État initial
const initialState: CharacterState = {
  character: null,
  abilities: null,
  classes: [],
  hitPoints: null,
  skills: [],
  isLoading: false,
  error: null,
};

export const CharacterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // 3. Logique calculée (Selectors)
  withComputed(({ classes, skills }) => ({
    sortedClasses: computed(() => {
      return [...classes()].sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        const nameA = a.customClassName ?? a.classType ?? '';
        const nameB = b.customClassName ?? b.classType ?? '';
        return nameA.localeCompare(nameB);
      });
    }),

    sortedSkills: computed(() => {
      const data = skills();
      if (!data || !Array.isArray(data)) return [];

      // On trie par .type (propriété venant du C#)
      return [...data].sort((a, b) => a.type.localeCompare(b.type));
    }),
  })),

  // 4. Méthodes d'action
  withMethods(
    (
      store,
      charService = inject(CharacterService),
      abilityService = inject(AbilityScoresService),
      classService = inject(CharacterClassService),
      hitPointsService = inject(HitPointsService),
      skillsService = inject(SkillsService),
    ) => {
      /**
       * Fonction utilitaire privée pour gérer les mises à jour répétitives (DRY)
       */
      const _updateEntity = <T>(
        serviceCall: (id: number, data: T) => Observable<T>,
        stateKey: keyof CharacterState,
        errorMessage: string,
      ) => {
        return pipe(
          switchMap((newData: T) => {
            const charId = store.character()?.id;
            if (!charId) return of(null);

            return serviceCall(charId, newData).pipe(
              tap({
                next: (result) => {
                  patchState(store, {
                    [stateKey]: result,
                    error: null,
                  });
                },
                error: (err) => {
                  console.error(`${errorMessage}:`, err);
                  patchState(store, { error: errorMessage });
                },
              }),
              catchError(() => of(null)),
            );
          }),
        );
      };

      return {
        /**
         * Charge l'ensemble des données du personnage en parallèle
         */
        loadCharacterData: rxMethod<number>(
          pipe(
            filter((id) => {
              const currentId = store.character()?.id;
              return currentId !== id || !!store.error() || !store.character();
            }),
            tap(() => patchState(store, { isLoading: true, error: null })),
            switchMap((id) =>
              forkJoin({
                character: charService.getById(id),
                abilities: abilityService.get(id),
                classes: classService.get(id),
                hitPoints: hitPointsService.get(id),
                skills: skillsService.get(id),
              }).pipe(
                tap({
                  next: (data) => patchState(store, { ...data, isLoading: false }),
                  error: (err) => {
                    console.error('Loading error:', err);
                    patchState(store, {
                      ...initialState,
                      error: 'Problem loading the character data',
                    });
                  },
                }),
                catchError(() => of(null)),
              ),
            ),
          ),
        ),

        // Mises à jour utilisant la méthode générique
    updateAbilities: rxMethod<AbilityScores>(
    pipe(
      switchMap((newData) => {
        const charId = store.character()?.id;
        if (!charId) return of(null);

        patchState(store, { isLoading: true });

        return abilityService.update(charId, newData).pipe(
          tap({
            next: (response) => {
              // ON MET À JOUR DEUX CLÉS D'UN COUP !
              patchState(store, { 
                abilities: response.abilities as any, // On met à jour les scores
                skills: response.skills,              // On met à jour les compétences recalculées
                isLoading: false,
                error: null 
              });
            },
            error: (err) => {
              console.error('Failed to update abilities:', err);
              patchState(store, { 
                error: 'Failed to update ability scores', 
                isLoading: false 
              });
            }
          }),
          catchError(() => of(null))
        );
      })
    )
  ),

        updateHp: rxMethod<HitPointsData>(
          _updateEntity(
            (id, data) => hitPointsService.update(id, data),
            'hitPoints',
            'Failed to update hit points',
          ),
        ),

        updateSkills: rxMethod<Skill[]>(
          _updateEntity(
            (id, data) => skillsService.update(id, data),
            'skills',
            'Failed to update skills'
          )
        ),

        /**
         * Réinitialise complètement le store
         */
        clear: () => patchState(store, initialState),
      };
    },
  ),
);
