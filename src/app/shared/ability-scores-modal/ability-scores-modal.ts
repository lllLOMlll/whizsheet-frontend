import { Component, input, output, ElementRef, viewChild, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ability-scores-modal',
  imports: [FormsModule],
  templateUrl: './ability-scores-modal.html',
  styleUrl: './ability-scores-modal.css',
})
export class AbilityScoresModal {
  label = input.required<string>();
  value = input.required<number>();
  isOpen = input<boolean>(false);

  save = output<number>();
  close = output<void>();

  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialogElement');
  tempValue = 0;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.tempValue = this.value();
        this.dialog()?.nativeElement.showModal();
      } else {
        this.dialog()?.nativeElement.close();
      }
    });
  }

  onClickOutside(event: MouseEvent, dialog: HTMLDialogElement) {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!isInDialog) {
      dialog.close();
    }
  }
}
