import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  isAdoptionFormOpen: boolean = false;
  // Opens the adoption form modal
  openAdoptionForm() {
    this.isAdoptionFormOpen = true;
    console.log('Adoption form modal opened!');
  }

  // Closes the adoption form modal
  closeAdoptionForm() {
    this.isAdoptionFormOpen = false;
  }
}
