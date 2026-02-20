import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, forkJoin, filter, catchError, of } from 'rxjs';

import { CharacterService, Character } from '../services/character';
import { CharacterClassService, CharacterClassData } from '../services/character-class';
import { AbilityScoresService, AbilityScores } from '../services/ability-scores';
import { HitPointsService, HitPointsData } from '../services/hit-points';

// 1. Définition de l'état
export interface CharacterState {
  character: Character | null;
  classes: CharacterClassData[];
  abilities: AbilityScores | null;
  hitPoints: HitPointsData | null; // Ajouté pour la cohérence
  isLoading: boolean;
  error: string | null;
}

// 2. État initial
const initialState: CharacterState = {
  character: null,
  classes: [],
  abilities: null,
  hitPoints: null,
  isLoading: false,
  error: null,
};

export const CharacterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // Logique de tri calculée
  withComputed(({ classes }) => ({
    sortedClasses: computed(() => {
      return [...classes()].sort((a, b) => {
        if (b.level !== a.level) return b.level - a.level;
        const nameA = a.customClassName ?? a.classType ?? '';
        const nameB = b.customClassName ?? b.classType ?? '';
        return nameA.localeCompare(nameB);
      });
    }),
  })),

  // Méthodes d'action
  withMethods((
    store,
    charService = inject(CharacterService),
    hitPointsService = inject(HitPointsService),
    classService = inject(CharacterClassService),
    abilityService = inject(AbilityScoresService)
  ) => ({
    
    /**
     * Charge toutes les données nécessaires pour un personnage.
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
            hitPoints: hitPointsService.get(id),
            classes: classService.get(id),
            abilities: abilityService.get(id),
          }).pipe(
            tap({
              next: ({ character, hitPoints, classes, abilities }) => {
                patchState(store, {
                  character,
                  hitPoints,
                  classes,
                  abilities,
                  isLoading: false,
                });
              },
              error: (err) => {
                console.error('Loading error:', err);
                patchState(store, {
                  ...initialState, // Reset propre de l'état
                  error: 'Problem loading the character data',
                });
              },
            }),
            catchError(() => of(null))
          )
        )
      )
    ),

    /**
     * Met à jour les scores de caractéristiques.
     */
    updateAbilities: rxMethod<AbilityScores>(
      pipe(
        switchMap((newScores) => {
          const charId = store.character()?.id;
          if (!charId) return of(null);

          return abilityService.update(charId, newScores).pipe(
            tap({
              next: (abilities) => {
                patchState(store, { 
                  abilities: { ...abilities },
                  error: null 
                });
              },
              error: (err) => {
                console.error('Update error:', err);
                patchState(store, { error: 'Failed to update ability scores' });
              }
            }),
            catchError(() => of(null))
          );
        })
      )
    ),

        updateHp: rxMethod<HitPointsData>(
      pipe(
        switchMap((newHp) => {
          const charId = store.character()?.id;
          if (!charId) return of(null);

          return hitPointsService.update(charId, newHp).pipe(
            tap({
              next: (hitPoints) => {
                patchState(store, { 
                  hitPoints: { ...hitPoints },
                  error: null 
                });
              },
              error: (err) => {
                console.error('Update error:', err);
                patchState(store, { error: 'Failed to update hit points' });
              }
            }),
            catchError(() => of(null))
          );
        })
      )
    ),

    /**
     * Réinitialise le store
     */
    clear: () => patchState(store, initialState),
  }))
);