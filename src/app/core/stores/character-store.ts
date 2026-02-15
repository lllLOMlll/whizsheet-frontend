import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, forkJoin, filter, catchError, of } from 'rxjs';
import { CharacterService, Character } from '../services/character';
import { CharacterClassService, CharacterClassData } from '../services/character-class';
import { AbilityScoresService, AbilityScores } from '../services/ability-scores';

// 1. Définition de l'état
export interface CharacterState {
  character: Character | null;
  classes: CharacterClassData[];
  abilities: AbilityScores | null;
  isLoading: boolean;
  error: string | null;
}

// 2. État initial
const initialState: CharacterState = {
  character: null,
  classes: [],
  abilities: null,
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
  withMethods((store, 
    charService = inject(CharacterService), 
    classService = inject(CharacterClassService),
    abilityService = inject(AbilityScoresService)
  ) => ({
    
    /**
     * Charge toutes les données nécessaires pour un personnage.
     * Utilise un filtre pour éviter les requêtes HTTP inutiles si les données sont déjà là.
     */
    loadCharacterData: rxMethod<number>(
      pipe(
        filter((id) => {
          const currentId = store.character()?.id;
          // On recharge si l'ID est différent, s'il y a une erreur, ou si le store est vide
          return currentId !== id || !!store.error() || !store.character();
        }),
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          forkJoin({
            char: charService.getById(id),
            classes: classService.get(id),
            abilities: abilityService.get(id),
          }).pipe(
            tap({
              next: ({ char, classes, abilities }) => {
                patchState(store, { 
                  character: char, 
                  classes: classes, 
                  abilities: abilities,
                  isLoading: false 
                });
              },
              error: (err) => {
                console.error('Loading error:', err);
                patchState(store, { 
                  error: 'Problem loading the character data', 
                  isLoading: false,
                  character: null,
                  classes: [],
                  abilities: null
                });
              }
            }),
            catchError(() => of(null))
          )
        )
      )
    ),

    /**
     * Met à jour les scores de caractéristiques sur le serveur et dans le store.
     */
updateAbilities: rxMethod<AbilityScores>(
  pipe(
    switchMap((newScores) => {
      const charId = store.character()?.id;
      if (!charId) return of(null);

      return abilityService.update(charId, newScores).pipe(
        tap({
          next: (updatedAbilities) => {
            // FORCE LA MISE À JOUR DU SIGNAL
            patchState(store, (state) => ({
              ...state,
              abilities: { ...updatedAbilities } 
            }));
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

    /**
     * Réinitialise le store (ex: lors de la déconnexion)
     */
    clear: () => patchState(store, initialState)
  }))
);