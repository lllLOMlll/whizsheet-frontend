import { inject, computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, forkJoin, filter } from 'rxjs';
import { CharacterService, Character } from '../services/character';
import { CharacterClassService, CharacterClassData } from '../services/character-class';

// 1. Définition de l'interface
export interface CharacterState {
  character: Character | null;
  classes: CharacterClassData[];
  isLoading: boolean;
  error: string | null;
}

// 2. Définition de l'état initial (C'est cette partie qui manquait peut-être)
const initialState: CharacterState = {
  character: null,
  classes: [],
  isLoading: false,
  error: null,
};

export const CharacterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState), // <--- L'erreur disparaîtra ici

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

  withMethods((store, 
    charService = inject(CharacterService), 
    classService = inject(CharacterClassService)
  ) => ({
    
    loadCharacterData: rxMethod<number>(
      pipe(
        // Le "Guard" : On ne continue que si l'ID est différent ou s'il y a une erreur
        filter((id) => {
          const currentId = store.character()?.id;
          return currentId !== id || !!store.error() || !store.character();
        }),

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