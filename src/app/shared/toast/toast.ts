import { Component, inject, computed } from '@angular/core';
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
      bottom: 20px;
      right: 20px;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    }

    /* Classes dynamiques */
    .success { background: #28a745; }
    .error { background: #dc3545; } /* Rouge */

    @keyframes slideIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
  `]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}