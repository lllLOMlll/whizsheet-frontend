import { Component, input, output, ElementRef, viewChild, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-boolean-edit-modal',
  imports: [FormsModule],
  templateUrl: './boolean-edit-modal.html',
  styleUrl: './boolean-edit-modal.css',
})
export class BooleanEditModal {
  title = input.required<string>();
  value = input.required<number>();
  isOpen = input<boolean>(false);

  save = output<number>();
  close = output<void>();

  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialogElement');
  tempValue = 0;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        // If the parent says that the modal should be open, open it!
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

  handleSave() {
    this.save.emit(this.tempValue);
    this.dialog()?.nativeElement.close();
  }
}
