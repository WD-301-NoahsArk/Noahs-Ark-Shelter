import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../component/button/button.component';

@Component({
  selector: 'app-admin-adoption',
  imports: [ CommonModule, ButtonComponent ],
  templateUrl: './admin-adoption.component.html',
  styleUrl: './admin-adoption.component.css'
})
export class AdminAdoptionComponent {
  constructor() { }

  addPet = () => {
    console.log("real");
  }

  delPet = () => {
    console.log("real");
  }

}
