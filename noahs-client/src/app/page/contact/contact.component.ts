import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [FormsModule]
})
export class ContactComponent {
  @Output() close = new EventEmitter<void>();

  isModalOpen = false;

  formData = {
    name: '',
    email: '',
    message: ''
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.close.emit(); // Notify parent to close modal if needed
  }

  onSubmit() {
    console.log('Form submitted:', this.formData);
    this.closeModal(); // Close the modal after submission
  }
}
