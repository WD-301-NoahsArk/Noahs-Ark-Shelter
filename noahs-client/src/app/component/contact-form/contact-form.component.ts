  import { Component, EventEmitter, Output } from '@angular/core';

  @Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
  })
  export class ContactFormComponent {
    @Output() close = new EventEmitter<void>();

    formData = {
      name: '',
      email: '',
      message: '',
    };

    closeModal() {
      this.close.emit(); // Emits event to parent to close modal
    }

    onSubmit() {
      console.log('Form submitted:', this.formData);
      this.closeModal(); // Close the modal after submission
    }
  }
