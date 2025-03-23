import { Component, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpService } from '../../http.service';
import { Animal } from '../../pages/adoption/adoption.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent {
  adoption = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    animal_code: '',
    date_avail: ''
  };

  isAdoptionFormOpen: boolean = false;
  petCode: string = '';
  petImage: string = 'assets/default-pet-image.png';
  adoptionDate: string = '';
  adoptionTime: string = '';
  http: any;

  constructor(private httpService: HttpService, private cdr: ChangeDetectorRef) {}

  // Opens the adoption form modal
  openAdoptionForm() {
    this.isAdoptionFormOpen = true;
    console.log('Adoption form modal opened!');
  }

  // Closes the adoption form modal
  closeAdoptionForm() {
    this.isAdoptionFormOpen = false;
  }

  updatePetImage() {
    this.cdr.detectChanges();

    if (!this.adoption.animal_code.trim()) {
      this.petImage = 'assets/images/default-pet-image.avif';
      return;
    }

    this.httpService.getAnimalByCode(this.adoption.animal_code).subscribe(
      (pet: Animal | null) => {
        if (pet) {
        }
        this.petImage = pet?.animal_pic || 'assets/images/default-pet-image.avif';
      },
      error => {
        this.petImage = 'assets/images/default-pet-image.avif';
      }
    );
  }


  submitApplication(form: NgForm) {
    if (!form.valid) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

    this.adoption.date_avail = `${this.adoptionDate} ${this.adoptionTime}`;

    this.httpService.submitAdoptionForm(this.adoption).subscribe(
      (response) => {
        alert("Adoption request submitted successfully!");
      },
      (error) => {
        alert("Something went wrong! Please try again.");
      }
    );
  }
}
