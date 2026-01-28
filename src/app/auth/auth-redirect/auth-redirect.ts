import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CharacterService } from '../../core/services/character';
import { AuthService } from '../auth';

@Component({
  selector: 'app-auth-redirect',
  imports: [],
  templateUrl: './auth-redirect.html',
  styleUrl: './auth-redirect.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthRedirectComponent implements OnInit {
  private characterService = inject(CharacterService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  

 async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.auth.storeToken(token);
    }

    const characters = await firstValueFrom(
      this.characterService.getAll()
    );

    if (characters.length === 0) {
      this.router.navigate(
        ['/characters/new'],
        { replaceUrl: true }
      );
    } else {
      this.router.navigate(
        ['/characters'],
        { replaceUrl: true }
      );
    }
  }
}
