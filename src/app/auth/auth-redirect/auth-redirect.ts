import { Component, inject, OnInit } from '@angular/core';
import { CharacterService } from '../../core/services/character';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-auth-redirect',
  imports: [RouterLink],
  templateUrl: './auth-redirect.html',
  styleUrl: './auth-redirect.css',
})
export class AuthRedirectComponent implements OnInit {
  private characterService = inject(CharacterService);
  private router = inject(Router);

  async ngOnInit() {
    const characters = await firstValueFrom(this.characterService.getAll());

    if (characters.length === 0) {
      this.router.navigate(['/characters/new']);
    } else {
      this.router.navigate(['/characters'])
    }
  }
}
