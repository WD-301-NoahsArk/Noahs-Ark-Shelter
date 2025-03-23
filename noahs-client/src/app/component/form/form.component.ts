import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  isAdoptionFormOpen: boolean = false;
  petCode: string = '';
  petImage: string = 'assets/default-pet-image.png';
  adoptionDate: string = '';
  adoptionTime: string = '';

  // Opens the adoption form modal
  openAdoptionForm() {
    this.isAdoptionFormOpen = true;
    console.log('Adoption form modal opened!');
  }

  // Closes the adoption form modal
  closeAdoptionForm() {
    this.isAdoptionFormOpen = false;
  }

  // Updates pet image based on the pet code input
  updatePetImage() {
    const petImages: { [key: string]: string } = {
      'PCH001': 'assets/pets/pch001.jpg',
      'PCH002': 'assets/pets/pch002.jpg',
      'PCH003': 'assets/pets/pch003.jpg',
      // Add more pet codes and their corresponding image URLs here
    };

    this.petImage = petImages[this.petCode] || 'assets/default-pet-image.png';
  }

  // Handles form submission
  submitApplication() {
    console.log("Adoption Form Submitted!");
    console.log("Full Name:", (document.getElementById('name') as HTMLInputElement).value);
    console.log("Email:", (document.getElementById('email') as HTMLInputElement).value);
    console.log("Phone:", (document.getElementById('phone') as HTMLInputElement).value);
    console.log("Pet Code:", this.petCode);
    console.log("Adoption Date:", this.adoptionDate);
    console.log("Adoption Time:", this.adoptionTime);

    // Close the form after submission
    this.closeAdoptionForm();
  }
}
