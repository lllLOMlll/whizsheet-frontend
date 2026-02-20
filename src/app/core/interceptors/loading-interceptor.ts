import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Active le spinner dès qu'une requête part
  loadingService.show();

  return next(req).pipe(
    // finalize garantit que le spinner se cache, même en cas d'erreur API
    finalize(() => loadingService.hide())
  );
};