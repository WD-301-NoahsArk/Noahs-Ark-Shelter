import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FooterComponent } from "./component/footer/footer.component";
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService, AuthService]
})

export class AppComponent implements OnInit {
  title = 'noahs-client';
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    initFlowbite();

    this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    this.authService.logout();
  }
}

