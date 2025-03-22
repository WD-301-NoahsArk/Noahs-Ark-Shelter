import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from "../../component/form/form.component";
import { HttpService } from '../../http.service';

export interface Animal {
  name: string;
  rescue_date: string;
  personality: Array<2>;
  breed: string;
  code: string;
  status: boolean;
  animal_pic: string;
}

@Component({
  selector: 'app-adoption',
  templateUrl: './adoption.component.html',
  styleUrls: ['./adoption.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormComponent,
  ]
})

export class AdoptionComponent implements OnInit {
  pets: Animal[] = [];
  selectedPet: Animal | null = null;

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.loadAnimals();
  }

  loadAnimals() {
    this.http.getAnimals().subscribe({
      next: (data: Animal[]) => {
        this.pets = data;
      },
      error: (err) => {
        console.error('Error loading animals:', err);
      }
    });
  }

  openModal(pet: Animal) {
    this.selectedPet = pet;
  }

  closeModal() {
    this.selectedPet = null;
  }

}


