import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    console.log('Logging out...');
  }
}
