import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.state(); as toast) {
      <div class="toast-container" [class]="toast.type">
        {{ toast.message }}
      </div>
    }
  `,
  styles: [`
    .toast-container {
      position: fixed;
      /* Positionnement en bas au centre */
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      z-index: 1000;
      
      /* Animation de montée */
      animation: slideInUp 0.3s ease-out;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
      text-align: center;
      min-width: 200px;
    }

    .success { background: #07c333; }
    .error { background: #dc3545; }

    /* Animation d'entrée par le bas */
    @keyframes slideInUp { 
      from { 
        transform: translate(-50%, 100%); 
        opacity: 0;
      } 
      to { 
        transform: translate(-50%, 0); 
        opacity: 1;
      } 
    }
  `]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}