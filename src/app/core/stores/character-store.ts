import { inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, forkJoin, catchError, of } from 'rxjs';
import { CharacterService, Character } from '../services/character';
import { CharacterClassService, CharacterClassData } from '../services/character-class';
import { computed } from '@angular/core';

// Définition de l'état
export interface CharacterState {
  character: Character | null;
  classes: CharacterClassData[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CharacterState = {
  character: null,
  classes: [],
  isLoading: false,
  error: null,
};

export const CharacterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  // Logique de tri et sélections calculées
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

  // Méthodes pour modifier l'état (Chargement API)
  withMethods((store, 
    charService = inject(CharacterService), 
    classService = inject(CharacterClassService)
  ) => ({
    
    loadCharacterData: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((id) =>
          forkJoin({
            char: charService.getById(id),
            classes: classService.get(id)
          }).pipe(
            tap({
              next: ({ char, classes }) => {
                patchState(store, { 
                  character: char, 
                  classes: classes, 
                  isLoading: false 
                });
              },
              error: (err) => {
                console.error('Loading error:', err);
                patchState(store, { 
                  error: 'Problem loading the character', 
                  isLoading: false,
                  character: null,
                  classes: []
                });
              }
            })
          )
        )
      )
    ),

    clear: () => patchState(store, initialState)
  }))
);