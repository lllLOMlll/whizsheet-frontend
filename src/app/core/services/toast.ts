import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
 state = signal<{ message: string; type: ToastType } | null>(null);


  show(message: string, type: ToastType = 'success', duration: number = 5000) {
    this.state.set({ 
      message,
      type,
    });

    setTimeout(() => this.state.set(null), duration)
  }
}
