import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../../component/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../component/footer/footer.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, FooterComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent { }
