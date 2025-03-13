import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() label: string = 'Button name here'; 
  @Output() clicked = new EventEmitter<void>(); 

  onClick() {
    this.clicked.emit();  
  }
}