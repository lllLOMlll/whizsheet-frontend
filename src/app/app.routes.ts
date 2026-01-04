import { Routes } from '@angular/router';
import { CharacterListComponent } from './character-list/character-list';
import { CharacterCreateComponent } from './character-create/character-create';

export const routes: Routes = [
    { path: '', redirectTo: 'characters', pathMatch: 'full'},
    { path: 'characters', component: CharacterListComponent},
    { path: 'characters/new', component: CharacterCreateComponent}
];
