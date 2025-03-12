import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdoptionComponent {
  pets = [
    { name: 'Pochiko', age: 2, personality: 'Playful', breed: 'Golden Retriever', status: 'Available', code: 'PCH001' },
    { name: 'Luna', age: 1, personality: 'Calm', breed: 'Siberian Husky', status: 'Adopted', code: 'LNA002' },
    { name: 'Max', age: 3, personality: 'Energetic', breed: 'Beagle', status: 'Available', code: 'MAX003' },
    { name: 'Bella', age: 4, personality: 'Friendly', breed: 'Labrador', status: 'Available', code: 'BLL004' },
    { name: 'Daisy', age: 2, personality: 'Curious', breed: 'Poodle', status: 'Adopted', code: 'DSY005' },
    { name: 'Rocky', age: 5, personality: 'Brave', breed: 'German Shepherd', status: 'Available', code: 'RCK006' }
  ];

  selectedPet: any = null;
  isAdoptionFormOpen: boolean = false;

  // Opens the pet details modal
  openModal(pet: any) {
    this.selectedPet = pet;
  }

  // Closes the pet details modal
  closeModal() {
    this.selectedPet = null;
  }

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
